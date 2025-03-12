using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Configuration;
using IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request;
using IDS.Lexik.WebService.Sdk.WebService.Abstract;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Tfres;
using HttpContext = Tfres.HttpContext;
using System.Data;
using CorpusExplorer.Sdk.Model.Adapter.Corpus;
using System.Linq;
using CorpusExplorer.Sdk.Helper;
using CorpusExplorer.Sdk.Model.Adapter.Corpus.Abstract;
using CorpusExplorer.Sdk.Utils.DocumentProcessing.Cleanup;
using CorpusExplorer.Sdk.Utils.DocumentProcessing.Tagger.TreeTagger;
using CorpusExplorer.Sdk.Utils.CorpusManipulation;
using IDS.OWIDplusLIVE.API.Model.Json.OwidLiveStorage;
using IDS.OWIDplusLIVE.API.Model.Response;
using CorpusExplorer.Sdk.Utils.DataTableWriter.Abstract;
using CorpusExplorer.Sdk.Utils.DataTableWriter;
using CorpusExplorer.Sdk.Model.Extension;
using CorpusExplorer.Sdk.Utils.Filter.Abstract;
using CorpusExplorer.Sdk.Utils.Filter.Queries;
using System.Security.Cryptography;
using System.Text;
using IDS.OWIDplusLIVE.API.Helper;
using CorpusExplorer.Sdk.Blocks.SelectionCluster.Generator;
using CorpusExplorer.Sdk.Blocks;
using System.Threading.Tasks;
using CorpusExplorer.Sdk.Blocks.NgramMultiLayerSelectiveQuery;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService
{
  public class WebService : AbstractEasyWebService<ServiceConfiguration>
  {
    private int _nMax = 5;

    private SHA512 _hash = SHA512.Create();
    private object _hashLock = new object();

    private object _syncLock = new object();
    private bool _syncPending = false;
    private Dictionary<int, CorpusAdapterWriteIndirect> _corpora = new Dictionary<int, CorpusAdapterWriteIndirect>();
    private Dictionary<int, Dictionary<string, Guid[]>> _selections = new Dictionary<int, Dictionary<string, Guid[]>>();

    private string _cec6path = "";

    private Dictionary<string, NormDataResponseItem> _normData = new Dictionary<string, NormDataResponseItem>();
    private string _normDataStr = "";

    private long _maxPostSize;
    private int _maxItems;
    private string _secureUpdateToken;
    private string _lastUpdateToken;
    private string _cachePath;

    private TimeSpan _cacheTime = TimeSpan.FromMinutes(30);
    private object _cacheLock = new object();
    private Dictionary<string, DateTime> _cache = new Dictionary<string, DateTime>();

    private Dictionary<string, AbstractTableWriter> _exporter = new Dictionary<string, AbstractTableWriter>
    {
      {"TSV", new TsvTableWriter() },
      {"HTML", new HtmlTableSnippetTableWriter() },
      {"SQL", new SqlTableWriter() },
      {"CSV", new CsvTableWriter() },
      {"XML", new XmlTableWriter() }
    };

    protected override void ConfigureEndpoints(Server server)
    {
      _cec6path = Path.Combine(AppPath, "cec6");
      _cachePath = Path.Combine(AppPath, "cache");

      if (Directory.Exists(_cachePath))
        Directory.Delete(_cachePath, true);
      Directory.CreateDirectory(_cachePath);
      if (!Directory.Exists(_cec6path))
        Directory.CreateDirectory(_cec6path);

      ReloadData();

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/v3/norm", Norm);
      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/v3/years", Years);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/v3/search", Search);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/v3/convert", Convert);

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/v3/token", Token);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/v3/update", Update); // TODO: token check

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/heartbeat", Heartbeat); //TODO
      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/ping", (arg) => arg.Response.Send(200));
    }

    private void Years(HttpContext arg)
    {
      try
      {
        arg.Response.Send(_corpora.Keys);
      }
      catch
      {
        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void Search(HttpContext arg)
    {
      try
      {
        var request = GetSearchRequest(arg);
        var dir = CachePathHelper.GetDirectory(_cachePath, request.N, request.Hash);

        if (Directory.Exists(dir))
        {
          var file = Path.Combine(dir, $"{request.Year}.json");
          if (File.Exists(file))
          {
            SearchResponseFullCached(arg, file);
          }
          else
            SearchResponseGetAdditionalYear(arg, request, dir);
        }
        else
          SearchResponseInitialSearch(arg, request, dir);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void SearchResponseInitialSearch(HttpContext arg, SearchRequest request, string dir)
    {
      if (!Directory.Exists(dir))
        Directory.CreateDirectory(dir);

      var @lock = new object();
      var limitter = new Dictionary<string, double>();
      var res = new Dictionary<string, Dictionary<string, double>>();

      var selections = _selections[request.Year];
      var corpus = _corpora[request.Year];

      #region Validation 
      if (request.N < 1)
      {
        arg.Response.Send(HttpStatusCode.BadRequest, $"N is smaller 1");
        return;
      }
      if (request.N > _nMax)
      {
        arg.Response.Send(HttpStatusCode.BadRequest, $"N is too large (N max={_nMax})");
        return;
      }
      #endregion
      var compiledQueries = QueryCompiler.Compile(corpus.ToSelection(), GetLayerAndQueries(request));

      Parallel.ForEach(selections, selection =>
      {
        var block = corpus.ToSelection(selection.Value).CreateBlock<NgramMultiLayerSelectiveBlock>();
        block.LayerDisplayname = "Wort";
        block.LayerQueriesPreCompiled = compiledQueries;
        block.Calculate();

        lock (@lock)
          foreach (var x in block.NGramFrequency)
          {
            if (limitter.ContainsKey(x.Key))
              limitter[x.Key] += x.Value;
            else
              limitter.Add(x.Key, x.Value);
            if (!res.ContainsKey(x.Key))
              res.Add(x.Key, new Dictionary<string, double>());
            res[x.Key].Add(selection.Key, x.Value);
          }
      });

      var limit = limitter.Count <= _maxItems ? limitter.Keys.ToArray() : limitter.OrderByDescending(x => x.Value).Take(_maxItems).Select(x => x.Key).ToArray();
      File.WriteAllLines(Path.Combine(dir, "limit.txt"), limit, Encoding.UTF8);
      limitter.Clear();
      res = limit.ToDictionary(x => x, x => res[x]);
      var str = JsonConvert.SerializeObject(res);
      res.Clear();
      arg.Response.Send(str);
      File.WriteAllText(Path.Combine(dir, $"{request.Year}.json"), str, Encoding.UTF8);
    }

    private static Dictionary<string, string[]> GetLayerAndQueries(SearchRequest request)
    {
      var layerNames = new HashSet<string>(request.Items.Select(x => x.LayerDisplayname));
      var layerAndQueries = layerNames.ToDictionary(x => x, x => new string[request.N]);
      foreach (var x in request.Items)
        if (x.Position < request.N)
          layerAndQueries[x.LayerDisplayname][x.Position] = x.Token;
      return layerAndQueries;
    }

    private void SearchResponseGetAdditionalYear(HttpContext arg, SearchRequest request, string dir)
    {
      if (!Directory.Exists(dir))
        Directory.CreateDirectory(dir);

      var @lock = new object();
      var res = new Dictionary<string, Dictionary<string, double>>();
      var limit = File.ReadAllLines(Path.Combine(dir, "limit.txt"), Encoding.UTF8);

      var selections = _selections[request.Year];
      var corpus = _corpora[request.Year];

      // no validation nessesary, because it is already done in the initial search
      Parallel.ForEach(selections, selection =>
      {
        var block = corpus.ToSelection(selection.Value).CreateBlock<Ngram1LayerSelectiveQuickLookupBlock>();
        block.LayerDisplayname = "Wort";
        block.LayerQueries = limit;
        block.Calculate();

        lock (@lock)
          foreach (var x in limit)
          {
            if (!res.ContainsKey(x))
              res.Add(x, new Dictionary<string, double>());
            res[x].Add(selection.Key, block.NGramFrequency.ContainsKey(x) ? block.NGramFrequency[x] : 0.0);
          }
      });

      var str = JsonConvert.SerializeObject(res);
      res.Clear();
      arg.Response.Send(str);
      File.WriteAllText(Path.Combine(dir, $"{request.Year}.json"), str, Encoding.UTF8);
    }

    private void SearchResponseFullCached(HttpContext arg, string file)
    {
      lock (_cacheLock)
        _cache[file] = DateTime.Now.Add(_cacheTime);
      arg.Response.Send(File.ReadAllText(file));
    }

    private SearchRequest GetSearchRequest(HttpContext arg)
    {
      var post = arg.PostDataAsString;
      var request = JsonConvert.DeserializeObject<SearchRequest>(post);
      lock (_hashLock)
        request.Hash = System.Convert.ToBase64String(_hash.ComputeHash(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(request.Items)))).Replace("/", "_");
      return request;
    }

    private void ReloadData()
    {
      try
      {
        var settings = JsonConvert.DeserializeObject<ServiceConfiguration>(File.ReadAllText(Path.Combine(AppPath, "config.cnf")));
        _maxPostSize = settings.MaxPostSize;
        _maxItems = settings.MaxItems;
        _secureUpdateToken = settings.SecureUpdateToken;
        _nMax = settings.N;

        lock (_syncLock)
        {
          _syncPending = false;
          try
          {
            foreach (var k in _corpora.Keys)
              _corpora[k].Dispose();
            _corpora.Clear();

            foreach (var fn in Directory.GetFiles(_cec6path, "*.cec6"))
            {
              var year = int.Parse(Path.GetFileNameWithoutExtension(fn));
              var corpus = CorpusAdapterWriteIndirect.Create(fn);
              _corpora.Add(year, corpus);

              var cluster = corpus.ToSelection().CreateBlock<SelectionClusterBlock>();
              cluster.ClusterGenerator = new SelectionClusterGeneratorStringValue();
              cluster.NoParent = true;
              cluster.MetadataKey = "D";
              cluster.Calculate();

              var days = cluster.SelectionClusters.ToDictionary(
                x => x.Key,
                x => x.Value.ToArray());

              _selections.Add(year, days);

              foreach (var d in days)
              {
                var sel = corpus.ToSelection(d.Value);
                var item = new NormDataResponseItem { Token = sel.CountToken, Sentences = sel.CountSentences };
                if (_normData.ContainsKey(d.Key))
                  _normData[d.Key] = item;
                else
                  _normData.Add(d.Key, item);
              }
            }

            _normDataStr = JsonConvert.SerializeObject(_normData);
          }
          catch
          {
            // ignore
          }
          _syncPending = false;
        }
      }
      catch (Exception ex)
      {
        // ignore
      }
    }

    private void Heartbeat(HttpContext arg)
    {
      try
      {
        arg.Response.Send(HttpStatusCode.OK);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void Token(HttpContext arg)
    {
      try
      {
        _lastUpdateToken = Guid.NewGuid().ToString("N");
        arg.Response.Send(_lastUpdateToken);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void Update(HttpContext arg)
    {
      try
      {
        var req = arg.PostData<UpdateRequest>();

        /* TODO
        using (var sha = SHA512.Create())
        {
          var dataHash = Convert.ToBase64String(sha.ComputeHash(Encoding.ASCII.GetBytes(req.Data)));

          var token = $"{dataHash}-{_lastUpdateToken}-{_secureUpdateToken}";
          if (req.SessionKey != Convert.ToBase64String(sha.ComputeHash(Encoding.ASCII.GetBytes(token))))
          {
            arg.Response.Send(HttpStatusCode.Forbidden);
            return;
          }
        }
        _lastUpdateToken = Guid.NewGuid().ToString("N");
        */

        if (!Directory.Exists(_cec6path))
          Directory.CreateDirectory(_cec6path);

        var fn = Path.Combine(_cec6path, $"{req.Year:D4}.cec6");
        var date = $"{req.Year:D4}-{req.Month:D2}-{req.Day:D2}";

        var oldData = Update_OpenCorpus(fn, date);

        var newTexts = req.Data.Split(new[] { "\n" }, StringSplitOptions.RemoveEmptyEntries)
          .Select(x => new Dictionary<string, object> { { "Text", x }, { "D", date } }).ToArray();
        req.Data = "";

        var clean01 = new StandardCleanup();
        clean01.Input.Enqueue(newTexts);
        clean01.Execute();
        newTexts = Array.Empty<Dictionary<string, object>>();

        var clean02 = new RegexXmlMarkupCleanup { Input = clean01.Output };
        clean02.Execute();

        var tagger = new SimpleTreeTagger { Input = clean02.Output, LanguageSelected = "Deutsch" };
        tagger.Execute();
        var newData = tagger.Output.First();
        var merged = oldData == null ? newData : CorpusMerger.Merge(new[] { oldData, newData });

        SaveCorpus(merged, fn);

        ReloadData();

        arg.Response.Send(HttpStatusCode.OK);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void SaveCorpus(AbstractCorpusAdapter merged, string fn)
    {
      lock (_syncLock)
      {
        _syncPending = true;
        try
        {
          var key = int.Parse(Path.GetFileNameWithoutExtension(fn));
          if (_corpora.ContainsKey(key))
            _corpora[key].Dispose();

          merged.Save(fn, false);
        }
        catch
        {
          // ignore
        }
        _syncPending = false;
      }
    }

    private AbstractCorpusAdapter Update_OpenCorpus(string fn, string excludeDate)
    {
      if (!File.Exists(fn))
        return null; // komplett neues Jahr
      var corpus = CorpusAdapterWriteDirect.Create(fn);

      var select = corpus.ToSelection();
      var tmp = select.CreateTemporary(new AbstractFilterQuery[] { new FilterQueryMetaExactMatch { MetaLabel = "D", MetaValues = new[] { excludeDate } } });
      // Überprüfe, ob der Tag bereits existiert
      if (tmp.CountDocuments == 0)
        return corpus;

      // Falls ja, aktualisiere den Tag
      var guids = new HashSet<Guid>(select.DocumentGuids);
      foreach (var x in tmp.DocumentGuids)
        guids.Remove(x);

      return select.CreateTemporary(guids).ToCorpus();
    }

    private void Convert(HttpContext arg)
    {
      try
      {
        if (arg.Request.ContentLength > _maxPostSize)
        {
          arg.Response.Send(HttpStatusCode.RequestUriTooLong);
          return;
        }

        var getParams = arg.Request.GetData();
        if (!getParams.ContainsKey("format"))
        {
          arg.Response.Send(HttpStatusCode.BadRequest);
          return;
        }

        var format = getParams["format"].ToUpper();
        if (!_exporter.ContainsKey(format))
        {
          arg.Response.Send(HttpStatusCode.MethodNotAllowed);
          return;
        }

        using var ms = new MemoryStream();
        var writer = _exporter[format].Clone(ms);

        var request = arg.PostData<NgramRecordResponse[]>();
        var n = request[0].Wordform.Length - 1.0;

        var dt = new DataTable();
        dt.Columns.Add("Wortform", typeof(string));
        dt.Columns.Add("Lemma", typeof(string));
        dt.Columns.Add("POS", typeof(string));
        dt.Columns.Add("Datum", typeof(string));
        dt.Columns.Add("Frequenz", typeof(double));
        dt.Columns.Add("Frequenz (ppm)", typeof(double));

        Dictionary<string, double> normHelper;
        lock (_syncLock)
          normHelper = _normData.ToDictionary(x => x.Key, x => x.Value.Token - (x.Value.Sentences * n));

        dt.BeginLoadData();
        foreach (var x in request)
          foreach (var y in x.Dates)
            try
            {
              dt.Rows.Add(x.Wordform, x.Lemma, x.Pos, y.Key, y.Value, (y.Value / normHelper[y.Key]) * 1000000.0);
            }
            catch
            {
              // ignore
            }
        dt.EndLoadData();

        writer.WriteTable(dt);

        ms.Seek(0, SeekOrigin.Begin);
        arg.Response.Send(ms, writer.MimeType);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void Norm(HttpContext arg)
    {
      try
      {
        lock (_syncLock)
          arg.Response.Send(_normDataStr);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    protected override OpenApiDocument GetDocumentation()
    {
      // TODO

      return new OpenApiDocument
      {
        Paths = new OpenApiPaths
        {
          {
            "/init", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Get, new OpenApiOperation
                  {
                    Description = "Sollte als erstes aufgerufen werden. Gibt eine zufällige SessionID zurück. Zukünftige Versionen können ggf. Authentifizierungen über SessionId erfordern.",
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "SessionID"}}
                    }
                  }
                }
              }
            }
          },
          {
            "/norm", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Get, new OpenApiOperation
                  {
                    Description = "Sollte als zweites aufgerufen werden. Gibt die Norm-Daten (Tages-Summe für unterschiedliche N-Gramme) zurück.",
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "Ein Array (Array-Position + 1 = N-Gramm-Länge) von Dictionarys (Tag : Summe)"}}
                    }
                  }
                }
              }
            }
          },
          {
            "/find", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Post, new OpenApiOperation
                  {
                    Description = "Sucht nach verfügbaren N-Grammen und gibt deren Schlüssel zurück.",
                    Parameters = new List<OpenApiParameter>
                    {
                      new OpenApiParameter
                      {
                        Name = "request", In = ParameterLocation.Query, Required = true,
                        Description = "Suchanfrage",
                        Schema = new OpenApiSchema
                        {
                          Type = "object",
                          Properties = new Dictionary<string, OpenApiSchema>
                          {
                            {"N", new OpenApiSchema {Type = "integer", Description = "Legt die Größe des N-Gramms fest."}},
                            {"Items", new OpenApiSchema
                              {
                                Type = "array",
                                Description = "Detailangabe zu Layer/Poistion/Token",
                                Items = new OpenApiSchema
                                {
                                  Type = "object",
                                  Properties = new Dictionary<string, OpenApiSchema>
                                  {
                                    {"Position", new OpenApiSchema {Type = "integer", Description = "0-basierte Positionsangabe"}},
                                    {"Layer", new OpenApiSchema {Type = "integer", Description = "Wortform = 0 / Lemma = 1 / POS = 2"}},
                                    {"Token", new OpenApiSchema {Type = "string"}},
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "Auflistung von bis zu 10K bekannten Zeitreihen."}}
                    }
                  }
                }
              }
            }
          },
          {
            "/pull", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Post, new OpenApiOperation
                  {
                    Description = "Ruft bekannte Zeitreihen ab. Schlüssel bekannter Zeitreihen können mittels /find gefunden werden.",
                    Parameters = new List<OpenApiParameter>
                    {
                      new OpenApiParameter
                      {
                        Name = "request", In = ParameterLocation.Query, Required = true,
                        Description = "Suchanfrage",
                        Schema = new OpenApiSchema
                        {
                          Type = "object",
                          Properties = new Dictionary<string, OpenApiSchema>
                          {
                            {"N", new OpenApiSchema {Type = "integer", Description = "Legt die Größe des N-Gramms fest. Schlüssel (Items) müssen diese Länge haben."}},
                            {"Items", new OpenApiSchema
                              {
                                Type = "array",
                                Description = "Bekannte Zeitreihen (Schlüssel)",
                                Items = new OpenApiSchema
                                {
                                  Type = "string",
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = ""}}
                    }
                  }
                }
              }
            }
          },
          {
            "/down", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Post, new OpenApiOperation
                  {
                    Description = "Ruft bekannte Zeitreihen ab und exportiert die Daten in ein gewähltes Format.",
                    Parameters = new List<OpenApiParameter>
                    {
                      new OpenApiParameter
                      {
                        Name = "request", In = ParameterLocation.Query, Required = true,
                        Description = "Suchanfrage",
                        Schema = new OpenApiSchema
                        {
                          Type = "object",
                          Properties = new Dictionary<string, OpenApiSchema>
                          {
                            {"N", new OpenApiSchema {Type = "integer", Description = "Legt die Größe des N-Gramms fest. Schlüssel (Items) müssen diese Länge haben."}},
                            {"Requests", new OpenApiSchema
                              {
                                Type = "array",
                                Description = "Bekannte Zeitreihen (Schlüssel)",
                                Items = new OpenApiSchema
                                {
                                  Type = "string",
                                }
                              }
                            },
                            {"Format", new OpenApiSchema{Type="string", Description = "Key für das gewünschte Export-Format. Zulässige Werte (aktuell nur): TSV"} }
                          }
                        }
                      }
                    },
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = ""}}
                    }
                  }
                }
              }
            }
          },
          {
            "/token", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Get, new OpenApiOperation
                  {
                    Description = "Sollte als erstes aufgerufen werden, wenn man Daten auf den Server schreiben möchte. Gibt einen zufällige Token zurück.",
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "Token"}}
                    }
                  }
                }
              }
            }
          },
          {
            "/update", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Post, new OpenApiOperation
                  {
                    Description = "Schreibt neue Daten auf den Server. Nur für autorisierte  Apps und Nutzer*innen.",
                    Parameters = new List<OpenApiParameter>
                    {
                      new OpenApiParameter
                      {
                        Name = "request", In = ParameterLocation.Query, Required = true,
                        Description = "Update",
                        Schema = new OpenApiSchema
                        {
                          Type = "object",
                          Properties = new Dictionary<string, OpenApiSchema>
                          {
                            {"Year", new OpenApiSchema {Type = "integer", Description = "Jahreszahl (vierstellig)"}},
                            {"Month", new OpenApiSchema {Type = "integer", Description = "Monat (zweistellig)"}},
                            {"Day", new OpenApiSchema {Type = "integer", Description = "Tag (zweistellig)"}},
                            {"Data", new OpenApiSchema {Type = "string", Description = "Die Daten TSV-Format müssen mittels GZip komprimiert und als Base64-String übermittelt werden."}},
                            {"SessionKey", new OpenApiSchema {Type = "string", Description = "Der SessionKey muss clientseitig berechnet werden. Berechnung: SHA512-Hash folgender Zeichenfolge: 'SHA512(Data)-TOKEN-SECRET'. SHA512(Data) ist der SHA512-Hash des GZip komprimierten Base64-Strings. Einmal TOKEN kann über /token abgerufen werden (nur einmalig gültig). SECRET muss bekannt sein und ist geheim."}},
                          }
                        }
                      }
                    },
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "OK"}}
                    }
                  }
                }
              }
            }
          },
          {
            "/heartbeat", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Get, new OpenApiOperation
                  {
                    Description = "Führt eine schnelle Validierung durch, die überprüft, ob alles wie erwartet funktioniert. Sollte in der Regel nur von Monitoring-Services aufgerufen werden.",
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "Alles ok!"}},
                      {"500", new OpenApiResponse {Description = "Es gibt Probleme (z. B. Server / Datenbank)"}}
                    }
                  }
                }
              }
            }
          },
        }
      };
    }

    protected override void LoadAdditionalConfiguration(ServiceConfiguration config)
    {
      ProjectName = "OWIDplusLIVE";

      _nMax = config.N;
      _maxPostSize = config.MaxPostSize;
      _secureUpdateToken = config.SecureUpdateToken;
    }

    protected override void LoadData()
    {
    }

    private static void WriteLog(Exception ex)
    {
      try
      {
        File.AppendAllText("error.log", $"-----\r\n{ex.Message}\r\n{ex.StackTrace}\r\n");
      }
      catch
      {
        // ignore
      }
    }
  }
}
