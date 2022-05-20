using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using CorpusExplorer.Sdk.Db.RocksDb;
using Elasticsearch.Net;
using Nest;

namespace IDS.Lexik.cOWIDplusViewer.v2.DataWriter
{
  class Program
  {
    private static byte _n = 3;

    [STAThread]
    static void Main(string[] args)
    {
      string[] files;
      if (args.Length == 0)
        return;

      files = Directory.GetFiles(args[0], "*.csv");

      var es = CreateClient("http://127.0.0.1:9200", "", "");
      Database.SetupElasticIndex(ref es);

      var rdbs = new Dictionary<byte, EasyRocksDb>();
      for (var i = 0; i < _n; i++)
        rdbs.Add((byte)(i + 1), new EasyRocksDb(Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), $"N{(i + 1):D2}"), true));

      foreach (var fn in files)
      {
        Console.WriteLine($"{fn}...");
        var sw = new Stopwatch();
        sw.Start();

        Database.InsertFromFile(fn, es, rdbs);

        sw.Stop();
        Console.WriteLine($"Einträge in {sw.ElapsedMilliseconds / 1000}s verarbeitet.");
      }

      Console.WriteLine("DONE!");
      Console.ReadLine();
    }

    public static class ParallelStepEnumerable
    {
      public static IEnumerable<int> Steps(int fromInclusive, int toExclusive, int step)
      {
        for (var i = fromInclusive; i < toExclusive; i += step)
          yield return i;
      }
    }

    private static ElasticClient CreateClient(string url, string user, string password)
    {
      var connection = new StaticConnectionPool(new[] { new Uri(url) });
      var settings = new ConnectionSettings(connection);
      if (!string.IsNullOrEmpty(user))
        settings.BasicAuthentication(user, password);
      settings.RequestTimeout(TimeSpan.FromSeconds(500));

      var client = new ElasticClient(settings);
      return client;
    }
  }
}
