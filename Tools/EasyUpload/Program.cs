using System;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request;
using Newtonsoft.Json;
using RestSharp;

namespace IDS.Lexik.OWIDplusLIVE.Upload
{
  class Program
  {
    static void Main(string[] args)
    {
      if (args.Length != 3)
      {
        Help();
        return;
      }

      if (!args[0].EndsWith("/"))
        args[0] = $"{args[0]}/";

      var url = args[0];
      var secret = args[1];
      var path = args[2];

      if (!DateTime.TryParseExact(Path.GetFileNameWithoutExtension(path), "yyyy-MM-dd", CultureInfo.CurrentCulture, DateTimeStyles.None, out var dt))
      {
        Help();
        return;
      }

      SendData(url, GetToken(url), dt, path, secret);
    }

    private static void SendData(string url, string token, DateTime date, string path, string secret)
    {
      var raw = File.ReadAllBytes(path);
      string data;
      using(var ms = new MemoryStream())
      { 
        using(var gz = new GZipStream(ms, CompressionLevel.Fastest))
          gz.Write(raw, 0, raw.Length);
        data = Convert.ToBase64String(ms.ToArray());
      }

      string sessionKey;
      using (var sha = SHA512.Create())
      {
        var dataHash = Convert.ToBase64String(sha.ComputeHash(Encoding.ASCII.GetBytes(data)));
        sessionKey = Convert.ToBase64String(sha.ComputeHash(Encoding.ASCII.GetBytes($"{dataHash}-{token}-{secret}")));
      }

      var client = new RestClient($"{url}update");
      var request = new RestRequest();
      request.AddJsonBody(new CowidPlusUpdateRequest
      {
        Data = data,
        Day = date.Day,
        Month = date.Month,
        SessionKey = sessionKey,
        Year = date.Year
      });
      request.Timeout = -1;

      var response = client.PostAsync(request);
      response.Wait();

      Console.WriteLine(response.Result.StatusCode);
    }

    private static string GetToken(string url)
    {
      var client = new RestClient($"{url}token");
      var request = new RestRequest();

      var response = client.GetAsync(request);
      response.Wait();
      
      return response.Result.Content;
    }

    private static void Help()
    {
      Console.WriteLine("IDS.Lexik.OWIDplusLIVE.Upload [URL] [secret] [LocalTsvPath]");
      Console.WriteLine("IDS.Lexik.OWIDplusLIVE.Upload http://127.0.0.1/ E1E6000E288345A5BA29E6F0FC129DF5 /home/pi/2020-02-28.tsv");
    }
  }
}
