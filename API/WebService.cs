﻿using System;
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
    private CorpusAdapterWriteIndirect[] _corpora = Array.Empty<CorpusAdapterWriteIndirect>();
    private Dictionary<int, int> _year2corpusIndex = new Dictionary<int, int>();
    private Dictionary<int, Dictionary<string, Guid>> _selections = new Dictionary<int, Dictionary<string, Guid>>();

    private string _cec6path = "";

    private Dictionary<string, NormDataResponseItem> _normData = new Dictionary<string, NormDataResponseItem>();
    private string _normDataStr = "";
    private int _defaultYear = 0;
    private int[] _years;

    private long _maxPostSize;
    private int _maxItems;
    private string _secureUpdateToken;
    private string _lastUpdateToken;
    private string _cachePath;

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

      if (!Directory.Exists(_cec6path))
        Directory.CreateDirectory(_cec6path);

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/heartbeat", Heartbeat);
      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/ping", (arg) => arg.Response.Send(200));

      ReloadData();

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/v3/norm", Norm);
      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/v3/years", Years);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/v3/search", Search);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/v3/convert", Convert);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/v3/lookup", Lookup);

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/v3/token", Token);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/v3/update", Update);
    }

    private void ClearCache()
    {
      try
      {
        if (Directory.Exists(_cachePath))
          Directory.Delete(_cachePath, true);
        Directory.CreateDirectory(_cachePath);
      }
      catch
      {
        // ignore
      }
    }

    private void Lookup(HttpContext arg)
    {
      try
      {
        var request = arg.PostData<LookupRequest>();
        var year = request.Year == 0 ? _defaultYear : request.Year;

        var keys = request.Query.Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries);

        var select = _corpora[_year2corpusIndex[year]].ToSelection();
        var block = select.CreateBlock<CorrespondingLayerValueSelectedBlock>();
        block.Layer1Displayname = "Wort";
        block.Layer2Displayname = request.LayerDisplayname;
        block.LayerValues = keys;
        block.Calculate();

        var stb = new StringBuilder();
        foreach (var x in keys)
          stb.Append(block.CorrespondingLayerValues.TryGetValue(x, out var value) ? $"{string.Join("|", value)} " : "? ");

        arg.Response.Send(new LookupResponse { Lookup = stb.ToString().Trim() });
      }
      catch
      {
        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void Years(HttpContext arg)
    {
      try
      {
        arg.Response.Send(_years);
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
        var year = request.Year == 0 ? _defaultYear : request.Year;

        if (Directory.Exists(dir))
        {
          var file = Path.Combine(dir, $"{year}.json");
          if (File.Exists(file))
            SearchResponseFullCached(arg, file);
          else
            SearchResponseGetAdditionalYear(arg, request, dir, year);
        }
        else
          SearchResponseInitialSearch(arg, request, dir, year);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void SearchResponseInitialSearch(HttpContext arg, SearchRequest request, string dir, int year)
    {
      if (!Directory.Exists(dir))
        Directory.CreateDirectory(dir);

      var @lock = new object();
      var limitter = new Dictionary<string, double>();
      var res = new Dictionary<string, Dictionary<string, double>>();

      var selections = _selections[year];
      var corpus = _corpora[_year2corpusIndex[year]];

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
        var block = corpus.ToSelection(new[] { selection.Value }).CreateBlock<NgramMultiLayerSelectiveBlock>();
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
      File.WriteAllText(Path.Combine(dir, $"{year}.json"), str, Encoding.UTF8);
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

    private void SearchResponseGetAdditionalYear(HttpContext arg, SearchRequest request, string dir, int year)
    {
      if (!Directory.Exists(dir))
        Directory.CreateDirectory(dir);

      var @lock = new object();
      var res = new Dictionary<string, Dictionary<string, double>>();
      var limit = File.ReadAllLines(Path.Combine(dir, "limit.txt"), Encoding.UTF8);

      var selections = _selections[year];
      var corpus = _corpora[_year2corpusIndex[year]];

      // no validation nessesary, because it is already done in the initial search
      Parallel.ForEach(selections, selection =>
      {
        var block = corpus.ToSelection(new[] { selection.Value }).CreateBlock<Ngram1LayerSelectiveQuickLookupBlock>();
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
      File.WriteAllText(Path.Combine(dir, $"{year}.json"), str, Encoding.UTF8);
    }

    private void SearchResponseFullCached(HttpContext arg, string file)
      => arg.Response.Send(File.ReadAllText(file));

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
            foreach (var c in _corpora)
              c.Dispose();

            var corpora = new List<CorpusAdapterWriteIndirect>();
            GetCorpusFiles(out var corporaFilesByYear, out var corporaFilesExtra);

            // Korpora die nicht jahrbasiert sind (z. B.: STATIC.cec6)
            foreach (var fn in corporaFilesExtra)
            {
              var corpus = CorpusAdapterWriteIndirect.Create(fn);
              var idx = corpora.Count;
              corpora.Add(corpus);

              var cluster = corpus.ToSelection().CreateBlock<SelectionClusterBlock>();
              cluster.ClusterGenerator = new SelectionClusterGeneratorStringValue();
              cluster.NoParent = true;
              cluster.MetadataKey = "D";
              cluster.Calculate();

              var days = cluster.SelectionClusters.ToDictionary(
                x => x.Key,
                x => x.Value.First());

              var years = days.Keys.Select(x => int.Parse(x.Substring(0, 4))).Distinct().ToArray();
              foreach (var year in years)
              {
                var sdays = days.Where(x => x.Key.StartsWith($"{year}-")).ToDictionary(x => x.Key, x => x.Value);
                _selections.Add(year, sdays);
                _year2corpusIndex.Add(year, idx);
              }

              foreach (var d in days)
              {
                var sel = corpus.ToSelection(new[] { d.Value });
                var item = new NormDataResponseItem { Token = sel.CountToken, Sentences = sel.CountSentences };
                if (_normData.ContainsKey(d.Key))
                  _normData[d.Key] = item;
                else
                  _normData.Add(d.Key, item);
              }
            }
            // Korpora die jahrbasiert (Dateiname: 2025.cec6) sind
            foreach (var fn in corporaFilesByYear)
            {
              var year = int.Parse(Path.GetFileNameWithoutExtension(fn));
              if (year > _defaultYear)
                _defaultYear = year;
              var corpus = CorpusAdapterWriteIndirect.Create(fn);

              _year2corpusIndex.Add(year, corpora.Count);
              corpora.Add(corpus);

              var cluster = corpus.ToSelection().CreateBlock<SelectionClusterBlock>();
              cluster.ClusterGenerator = new SelectionClusterGeneratorStringValue();
              cluster.NoParent = true;
              cluster.MetadataKey = "D";
              cluster.Calculate();

              var days = cluster.SelectionClusters.ToDictionary(
                x => x.Key,
                x => x.Value.First());

              _selections.Add(year, days);

              foreach (var d in days)
              {
                var sel = corpus.ToSelection(new[] { d.Value });
                var item = new NormDataResponseItem { Token = sel.CountToken, Sentences = sel.CountSentences };
                if (_normData.ContainsKey(d.Key))
                  _normData[d.Key] = item;
                else
                  _normData.Add(d.Key, item);
              }
            }

            _corpora = corpora.ToArray();
            _years = _year2corpusIndex.Keys.OrderBy(x => x).ToArray();
            _normDataStr = JsonConvert.SerializeObject(_normData);
          }
          catch
          {
            // ignore
          }

          ClearCache();

          _syncPending = false;
        }
      }
      catch (Exception ex)
      {
        // ignore
      }
    }

    private void GetCorpusFiles(out string[] corporaFilesByYear, out string[] corporaFilesExtra)
    {
      var files = Directory.GetFiles(_cec6path, "*.cec6");
      var rByYear = new List<string>();
      var rExtra = new List<string>();

      foreach (var fn in files)
      {
        var valid = int.TryParse(Path.GetFileNameWithoutExtension(fn), out var year);
        if (valid)
        {
          if (year > _defaultYear)
            _defaultYear = year;
          rByYear.Add(fn);
        }
        else
          rExtra.Add(fn);
      }

      corporaFilesByYear = rByYear.ToArray();
      corporaFilesExtra = rExtra.ToArray();
    }

    private void Heartbeat(HttpContext arg)
    {
      try
      {
        lock (_syncLock)
          arg.Response.Send(string.IsNullOrEmpty(_normDataStr) ? HttpStatusCode.Processing : HttpStatusCode.OK);
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

        using (var sha = SHA512.Create())
        {
          var dataHash = System.Convert.ToBase64String(sha.ComputeHash(Encoding.ASCII.GetBytes(req.Data)));

          var token = $"{dataHash}-{_lastUpdateToken}-{_secureUpdateToken}";
          if (req.SessionKey != System.Convert.ToBase64String(sha.ComputeHash(Encoding.ASCII.GetBytes(token))))
          {
            arg.Response.Send(HttpStatusCode.Forbidden);
            return;
          }
        }
        _lastUpdateToken = Guid.NewGuid().ToString("N");

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
          if (_year2corpusIndex.TryGetValue(key, out var idx))
            _corpora[idx].Dispose();

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
        if (!getParams.ContainsKey("n"))
        {
          arg.Response.Send(HttpStatusCode.BadRequest);
          return;
        }
        var n = int.Parse(getParams["n"]);

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

        string hash;
        var post = JsonConvert.DeserializeObject<SearchRequestItem[]>(arg.PostDataAsString);

        lock (_hashLock)
          hash = System.Convert.ToBase64String(_hash.ComputeHash(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(post)))).Replace("/", "_");
        var dir = CachePathHelper.GetDirectory(_cachePath, n, hash);

        if (!Directory.Exists(dir))
        {
          arg.Response.Send(HttpStatusCode.NotFound);
          return;
        }

        var years = Directory.GetFiles(dir, "*.json").Select(x => int.Parse(Path.GetFileNameWithoutExtension(x))).ToArray();
        if (years.Length == 0)
        {
          arg.Response.Send(HttpStatusCode.NotFound);
          return;
        }

        var data = new Dictionary<string, Dictionary<string, double>>();
        foreach (var year in years)
        {
          var file = Path.Combine(dir, $"{year}.json");
          var tmp = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, double>>>(File.ReadAllText(file));
          foreach (var x in tmp)
          {
            if (!data.ContainsKey(x.Key))
              data.Add(x.Key, new Dictionary<string, double>());
            foreach (var y in x.Value)
              data[x.Key].Add(y.Key, y.Value);
          }
        }

        using var ms = new MemoryStream();
        var writer = _exporter[format].Clone(ms);

        var dt = new DataTable();
        dt.Columns.Add("N-Gramm", typeof(string));
        dt.Columns.Add("Datum", typeof(string));
        dt.Columns.Add("Frequenz", typeof(double));
        dt.Columns.Add(format == "XML" ? "Frequenz_ppm" : "Frequenz (ppm)", typeof(double));

        var nD = (double)n;
        Dictionary<string, double> normHelper;
        lock (_syncLock)
          normHelper = _normData.ToDictionary(x => x.Key, x => x.Value.Token - (x.Value.Sentences * nD));

        dt.BeginLoadData();
        foreach (var x in data)
          foreach (var y in x.Value)
            try
            {
              dt.Rows.Add(x.Key, y.Key, y.Value, (y.Value / normHelper[y.Key]) * 1000000.0);
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
      return new OpenApiDocument
      {
        Paths = new OpenApiPaths
        {
          {
            "/v3/years", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Get, new OpenApiOperation
                  {
                    Description = "Gibt die verfügbaren Jahre zurück.",
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "Verfügbare Jahre als Array"}}
                    }
                  }
                }
              }
            }
          },
          {
            "/v3/norm", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Get, new OpenApiOperation
                  {
                    Description = "Gibt die Norm-Daten (Tages-Summe) zurück.",
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "Ein Dictionary (Tag : t/s) - t = Basiswert für N=1 / zur Berchnung von N=2 (t - s) / zur Berechnung von N=3 (t - s*2) / usw."}}
                    }
                  }
                }
              }
            }
          },
          {
            "/v3/search", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Post, new OpenApiOperation
                  {
                    Description = "Sucht nach verfügbaren N-Grammen.",
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
                            {"Year", new OpenApiSchema {Type = "integer", Description = "Jahr das abgefragt wird (siehe GET /v3/years). Das erste Jahr pro Abfrage ist das Fokus-Jahr (zusätzliche Berechnung der 1000 häufigsten N-Gramme)."}},
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
                      {"200", new OpenApiResponse {Description = "Bis zu 1000 der häufigsten N-Gramme für die Abfrage."}}
                    }
                  }
                }
              }
            }
          },
          {
            "/v3/lookup", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Post, new OpenApiOperation
                  {
                    Description = "Löst ein N-Gramm in korrespondierende Layer-Werte auf.",
                    Parameters = new List<OpenApiParameter>
                    {
                      new OpenApiParameter
                      {
                        Name = "request", In = ParameterLocation.Query, Required = true,
                        Description = "Lookup-Anfrage",
                        Schema = new OpenApiSchema
                        {
                          Type = "object",
                          Properties = new Dictionary<string, OpenApiSchema>
                          {
                            {"Year", new OpenApiSchema {Type = "integer", Description = "Jahr das abgefragt wird (siehe GET /v3/years)."}},
                            {"Layer", new OpenApiSchema {Type = "integer", Description = "Wortform = 0 / Lemma = 1 / POS = 2"}},
                            {"Query", new OpenApiSchema {Type = "string", Description = "N-Gramme als string (Leerzeichen getrennt)"}}
                          }
                        }
                      }
                    },
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "Ergebnis in Lookup - zusammengesetztr String"}}
                    }
                  }
                }
              }
            }
          },
          {
            "/v3/convert", new OpenApiPathItem
            {
              Operations = new Dictionary<OperationType, OpenApiOperation>
              {
                {
                  OperationType.Post, new OpenApiOperation
                  {
                    Description = "Konvertiert die Ausgabe von POST /v3/search in ein gewünschtes Format.",
                    Parameters = new List<OpenApiParameter>
                    {
                      new OpenApiParameter
                      {
                        Name = "format", In = ParameterLocation.Path, Required = true,
                        Description = "Gewünschtes Export-Format. Gültige Werte: CSV, TSV, HTML, SQL, XML",
                      },
                      new OpenApiParameter
                      {
                        Name = "request", In = ParameterLocation.Query, Required = true,
                        Description = "Ausgabe von POST /v3/search",
                        Schema = new OpenApiSchema
                        {
                          Type = "object",
                        }
                      }
                    },
                    Responses = new OpenApiResponses
                    {
                      {"200", new OpenApiResponse {Description = "Daten im gewünschten Format."}}
                    }
                  }
                }
              }
            }
          },
          {
            "/v3/token", new OpenApiPathItem
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
            "/v3/update", new OpenApiPathItem
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
                            {"Data", new OpenApiSchema {Type = "string", Description = "Alle Dokumente als ein String. Keine Umbrüche im Dokument. Neue Zeile (\\n) = Neues Dokument."}},
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
