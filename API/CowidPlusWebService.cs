using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using CorpusExplorer.Sdk.Db.RocksDb;
using Elasticsearch.Net;
using IDS.Lexik.cOWIDplusViewer.v2.DataWriter;
using IDS.Lexik.cOWIDplusViewer.v2.DataWriter.Model;
using IDS.Lexik.cOWIDplusViewer.v2.WebService.Exporter;
using IDS.Lexik.cOWIDplusViewer.v2.WebService.Exporter.Abstract;
using IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Configuration;
using IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request;
using IDS.Lexik.WebService.Sdk.WebService.Abstract;
using Microsoft.OpenApi.Models;
using Nest;
using Newtonsoft.Json;
using Tfres;
using HttpContext = Tfres.HttpContext;
using IDS.Lexik.WebService.Sdk.WaitBehaviour.Abstract;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService
{
  public class CowidPlusWebService : AbstractEasyWebService<CowidPlusWebConfiguration>
  {
    private int _n = 3;

    private ElasticClient _es;
    private Dictionary<byte, EasyRocksDb> _dbs;
    private string _dbPath;
    private long _maxPostSize;
    private bool _enableLogging;
    private string _secureUpdateToken;
    private string _lastUpdateToken;

    private AbstractExporter[] _exporter =
    {
      new ExporterTsv(),
    };

    protected override void ConfigureEndpoints(Server server)
    {
      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/init", Init);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/find", Find);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/pull", Pull);
      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/norm", Norm);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/down", Down);

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/token", Token);
      server.AddEndpoint(System.Net.Http.HttpMethod.Post, "/update", Update);

      server.AddEndpoint(System.Net.Http.HttpMethod.Get, "/heartbeat", Validate);
    }

    private void Validate(HttpContext arg)
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

        Database.SetupElasticIndex(ref _es);

        Database.InsertFromWebRequest(req.Data, new DateTime(req.Year, req.Month, req.Day), _es, _dbs);

        arg.Response.Send(HttpStatusCode.OK);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
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

    private void Down(HttpContext arg)
    {
      try
      {
        if (arg.Request.ContentLength > _maxPostSize)
        {
          arg.Response.Send(HttpStatusCode.RequestUriTooLong);
          return;
        }

        var request = arg.PostData<CowidPlusDownRequest>();
        foreach (var e in _exporter)
          if (e.Id == request.Format.ToUpper())
          {
            var db = _dbs[request.N];
            e.Convert(arg, ref db, request.N, request.Requests);
            return;
          }
        arg.Response.Send(HttpStatusCode.NotFound);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);

        arg.Response.Send(HttpStatusCode.InternalServerError);
      }
    }

    private void Find(HttpContext arg)
      => FindCall(arg, 10000);

    private void FindCall(HttpContext arg, int max)
    {
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
    }

    private void Pull(HttpContext arg)
    {
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
    }

    private void Norm(HttpContext arg)
    {
      try
      {
        var stb = new StringBuilder();
        stb.Append("[");
        for (byte i = 1; i <= _n; i++)
          stb.Append($"{_dbs[i].Get($">{i}")}}}{(i != _n ? "," : "")}");
        stb.Append("]");
        arg.Response.Send(stb.ToString());
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

      _dbPath = config.RocksDbPath;
      _n = config.N;
      _maxPostSize = config.MaxPostSize;
      _enableLogging = config.EnableLogging;
      _secureUpdateToken = config.SecureUpdateToken;

      if (_enableLogging && !Directory.Exists("log"))
        Directory.CreateDirectory("log");
    }

    protected override void LoadData()
    {
      Console.WriteLine();
      Console.Write("Start ElasticSearch...");
      _es = CreateClient("http://127.0.0.1:9200", "", "", "entries");
      Console.WriteLine("OK");

      _dbs = new Dictionary<byte, EasyRocksDb>();
      for (byte i = 0; i < _n; i++)
      {
        try
        {
          var lockFile = Path.Combine(_dbPath, $"N{(i + 1):D2}") + "/LOCK";
          if (File.Exists(lockFile))
            File.Delete(lockFile);

          Console.Write($"Start RocksDB N{(i + 1):D2}...");
          _dbs.Add((byte)(i + 1), new EasyRocksDb(Path.Combine(_dbPath, $"N{(i + 1):D2}"), true));
          Console.WriteLine("OK");
        }
        catch (Exception ex)
        {
          Console.WriteLine(ex.Message);
          Console.WriteLine(ex.StackTrace);
        }
      }
    }

    private static ElasticClient CreateClient(string url, string user, string password, string index)
    {
      var connection = new StaticConnectionPool(new[] { new Uri(url) });
      var settings = new ConnectionSettings(connection);
      if (!string.IsNullOrEmpty(user))
        settings.BasicAuthentication(user, password);
      settings.RequestTimeout(TimeSpan.FromSeconds(500));

      var client = new ElasticClient(settings);
      ((ConnectionSettings)client.ConnectionSettings).DefaultIndex(index);

      return client;
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
