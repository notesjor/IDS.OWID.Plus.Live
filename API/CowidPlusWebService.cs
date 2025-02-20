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

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService
{
  public class CowidPlusWebService : AbstractEasyWebService<CowidPlusWebConfiguration>
  {
    private int _nMax = 5;
    private int _normData; // TODO

    private long _maxPostSize;
    private string _secureUpdateToken;
    private string _lastUpdateToken;

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
      ReloadData();

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/init", Init); // ok
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/find", Find);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/pull", Pull);
      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/norm", Norm);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/search", Search);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/convert", Convert); // früher down

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/token", Token); // ok
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/update", Update); // TODO: token check

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/heartbeat", Validate);
    }

    private void Search(HttpContext arg)
    {
      try
      {

      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void ReloadData()
    {

    }

    private void Validate(HttpContext arg)
    {
      try
      {
        /* TODO
        #region RocksDB-Check
        for (byte i = 1; i <= _n; i++)
          if(string.IsNullOrWhiteSpace(_dbs[i].Get($">{i}")))
            throw new Exception($"N{i} is empty!");
        #endregion
        
        #region ElasticSearch-Check
        var subq = new List<QueryContainer>
        {
          new TermQuery
          {
            Field = "n",
            Value = 1
          },
          new QueryStringQuery
          {
            Query = "die",
            Fields = "l0"
          }
        };

        var container = new QueryContainer(new BoolQuery { Must = subq });

        var items = _es.Search<EsEntry>(s => s.Query(q => container).Source(src => src.Includes(i => i.Field("key"))).Size(1));
        if (items.Hits.Count != 1)
          throw new Exception("ElasticSearch - Connection Error!");
        #endregion
        */

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
        var req = arg.PostData<CowidPlusUpdateRequest>();

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

        if (!Directory.Exists("cec6"))
          Directory.CreateDirectory("cec6");

        var fn = Path.Combine("cec6", $"{req.Year:D4}.cec6");

        var oldData = File.Exists(fn) ? CorpusAdapterWriteDirect.Create(fn) : null;

        var date = $"{req.Year:D4}-{req.Month:D2}-{req.Day:D2}";
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

        UpdateNormData(newData, req.Year, date);

        var merged = oldData == null ? newData : CorpusMerger.Merge(new[] { oldData, newData });

        merged.Save(fn, false);

        arg.Response.Send(HttpStatusCode.OK);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void UpdateNormData(AbstractCorpusAdapter newData, int year, string key)
    {
      if (!Directory.Exists("json"))
        Directory.CreateDirectory("json");

      var fn = Path.Combine("json", $"{year:D4}.json");

      var normData = new Dictionary<string, OwidLiveNormData>();
      try
      {
        normData = JsonConvert.DeserializeObject<Dictionary<string, OwidLiveNormData>>(File.ReadAllText(fn));
      }
      catch (Exception ex)
      {
        // ignore
      }

      var nEntry = new OwidLiveNormData
      {
        Token = newData.CountToken,
        Sentences = newData.CountSentences,
      };

      if (normData.ContainsKey(key))
        normData[key] = nEntry;
      else
        normData.Add(key, nEntry);

      try
      {
        File.WriteAllText(fn, JsonConvert.SerializeObject(normData));
      }
      catch
      {
        // ignore
      }
    }

    private void Init(HttpContext arg)
    {
      try
      {
        arg.Response.Send(Guid.NewGuid().ToString("N"));
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
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

        var dt = new DataTable();
        dt.Columns.Add("Wortform", typeof(string));
        dt.Columns.Add("Lemma", typeof(string));
        dt.Columns.Add("POS", typeof(string));
        dt.Columns.Add("Datum", typeof(DateTime));
        dt.Columns.Add("Frequenz", typeof(double));

        dt.BeginLoadData();
        foreach (var x in request)
        {
          foreach (var y in x.Dates)
          {
            dt.Rows.Add(x.Wordform, x.Lemma, x.Pos, y.Key, y.Value);
          }
        }
        dt.EndLoadData();

        writer.WriteTable(dt);
        arg.Response.Send(ms.ToArray(), writer.MimeType);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void Find(HttpContext arg)
      => FindCall(arg, 1000);

    private void FindCall(HttpContext arg, int max)
    {
      /* TODO
      try
      {
        var post = arg.PostDataAsString;
        if (_enableLogging && arg.Request.Headers.ContainsKey("sessionKey"))
        {
          var dir = $"log/{arg.Request.Headers["sessionKey"]}/";
          if (!Directory.Exists(dir))
            Directory.CreateDirectory(dir);
          File.WriteAllText($"{dir}{Directory.GetFiles(dir).Length:D4}.json", post, Encoding.UTF8);
        }

        Console.WriteLine(post);
        var req = JsonConvert.DeserializeObject<CowidPlusFindRequest>(post);

        var subq = new List<QueryContainer>
        {
          new TermQuery
          {
            Field = "n",
            Value = req.N
          }
        };
        // ReSharper disable once LoopCanBeConvertedToQuery
        foreach (var x in req.Items)
        {
          subq.Add(new QueryStringQuery
          {
            Query = x.Query,
            Fields = x.Fields
          });
        }

        var container = new QueryContainer(new BoolQuery { Must = subq });

        var items = _es.Search<EsEntry>(s => s.Query(q => container).Source(src => src.Includes(i => i.Field("key")))
                                              .Size(max));
        Console.WriteLine(items.Hits.Count);
        arg.Response.Send(new CowidPlusPullRequest
        {
          N = req.N,
          Items = items.Hits.Select(x => x.Source.Key).ToArray()
        });
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
      */
    }

    private void Pull(HttpContext arg)
    {
      /* TODO
      try
      {
        var req = arg.PostData<CowidPlusPullRequest>();

        arg.Response.SendChunk("{");

        var items = _dbs[req.N].GetBatch(req.Items);
        var last = items.Length - 1;

        for (var i = 0; i < items.Length; i++)
        {
          arg.Response
             .SendChunk($"\"{HttpUtility.JavaScriptStringEncode(items[i].Key)}\":{(string.IsNullOrWhiteSpace(items[i].Value) ? "null" : items[i].Value)}}}");
          if (i < last)
            arg.Response.SendChunk(",");
        }

        arg.Response.SendFinalChunk("}");
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
      */
    }

    private void Norm(HttpContext arg)
    {
      try
      {
        arg.Response.Send(_normData);
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

    protected override void LoadAdditionalConfiguration(CowidPlusWebConfiguration config)
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
