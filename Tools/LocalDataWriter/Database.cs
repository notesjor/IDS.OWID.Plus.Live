using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CorpusExplorer.Sdk.Db.RocksDb;
using IDS.Lexik.cOWIDplusViewer.v2.DataWriter.Model;
using IDS.Lexik.cOWIDplusViewer.v2.DataWriter.Model.Csv;
using Nest;

namespace IDS.Lexik.cOWIDplusViewer.v2.DataWriter
{
  public class Database
  {
    public static void SetupElasticIndex(ref ElasticClient client)
    {
      ((ConnectionSettings)client.ConnectionSettings).DefaultIndex("entries");

      if (client.Indices.Exists("entries").Exists)
        return;

      client.Map<EsEntry>(x => x.AutoMap());

      // Insert a empty dummy into ES to setup the index complete.
      client.IndexDocument(new EsEntry
      {
        Key = "",
        N = 0
      });
    }

    public static void InsertFromWebRequest(string data, DateTime date, ElasticClient es, Dictionary<byte, EasyRocksDb> rdbs)
    {
      var items = new Dictionary<string, CsvEntry>();

      // Step 1: Parse CSV-File
      using (var fs = new MemoryStream(Convert.FromBase64String(data)))
      using (var gzip = new GZipStream(fs, CompressionMode.Decompress))
      using (var reader = new StreamReader(gzip, Encoding.UTF8))
      {
        reader.ReadLine(); // Skip header

        while (!reader.EndOfStream)
        {
          try
          {
            var item = CsvEntry.Step1_ReadLine(reader.ReadLine());
            if (item.Frequency > 0)
              items.Add(item.Key, item);
          }
          catch
          {
            // ignore
          }
        }
      }

      Insert(es, rdbs, items, date);
    }

    public static void InsertFromFile(string fn, ElasticClient es, Dictionary<byte, EasyRocksDb> rdbs)
    {
      var date = DateTime.ParseExact(Path.GetFileNameWithoutExtension(fn), "yyyy-MM-dd", CultureInfo.CurrentCulture);
      var items = new Dictionary<string, CsvEntry>();

      // Step 1: Parse CSV-File
      using (var fs = new FileStream(fn, FileMode.Open, FileAccess.Read, FileShare.Read))
      using (var reader = new StreamReader(fs, Encoding.UTF8))
      {
        reader.ReadLine(); // Skip header

        while (!reader.EndOfStream)
        {
          try
          {
            var item = CsvEntry.Step1_ReadLine(reader.ReadLine());
            if (item.Frequency > 0)
              items.Add(item.Key, item);
          }
          catch
          {
            // ignore
          }
        }
      }

      Insert(es, rdbs, items, date);
    }

    private static void Insert(ElasticClient es, Dictionary<byte, EasyRocksDb> rdbs, Dictionary<string, CsvEntry> items, DateTime date)
    {
      // For all items Step 2, 3, and 4
      var chunkSize = 100;
      for (var i = 0; i < items.Count; i+= chunkSize)
        ProcessItems(es, rdbs, date, items.Values.Skip(i).Take(chunkSize).ToArray());

      // Step 5 - calculate sums
      var sums = new Dictionary<byte, long>();
      foreach (var item in items)
      {
        if (sums.ContainsKey(item.Value.N))
          sums[item.Value.N] += item.Value.Frequency;
        else
          sums.Add(item.Value.N, item.Value.Frequency);
      }

      // Step 6 - write sums
      WriteSums(rdbs, date, sums);

      // Step 7 - clear all
      items.Clear();
      sums.Clear();
      GC.Collect();
    }

    private static void ProcessItems(ElasticClient es, Dictionary<byte, EasyRocksDb> rdbs, DateTime date, CsvEntry[] items)
    {
      try
      {
        // Step 2 - Find existing entries
        var itemDic = new Dictionary<string, int>();
        for (var i = 0; i < items.Length; i++)
          itemDic.Add(items[i].Key, i);

        var entriesExists = es.GetMany<EsEntry>(itemDic.Keys).ToArray();
        var found = entriesExists.Count(x => x.Found);
        Console.WriteLine($"> von {items.Length} Einträgen existieren bereits {found}");

        // Step 3 - If a item is new create it (use _u - to generate a unique id)
        var entriesNew = entriesExists.Where(x => !x.Found).Select(hit => items[itemDic[hit.Id]].Step2_MakeEsEntry())
                                      .ToList();
        if (entriesNew.Count > 0)
          es.IndexMany(entriesNew);

        // Step 4 - Write frequency
        Parallel.ForEach(items, x =>
        {
          var rdb = rdbs[x.N];
          var entry = rdb.Get(x.Key);
          if (entry == null || string.IsNullOrEmpty(entry))
            rdb.Put(x.Key, $"{{\"{date:yyyy-MM-ddTHH:mm:ss}\":{x.Frequency}");
          else
            rdb.Put(x.Key, $"{entry},\"{date:yyyy-MM-ddTHH:mm:ss}\":{x.Frequency}");
        });

        // CLEAN
        itemDic.Clear();
      }
      catch
      {
        // ignore
      }
    }

    private static void WriteSums(Dictionary<byte, EasyRocksDb> rdbs, DateTime date, Dictionary<byte, long> sums)
    {
      // Step 5 - Prepare Sums
      foreach (var sum in sums)
      {
        var rdb = rdbs[sum.Key];
        var key = $">{sum.Key}";
        var entry = rdb.Get(key);
        if (entry == null || string.IsNullOrEmpty(entry))
          rdb.Put(key, $"{{\"{date:yyyy-MM-ddTHH:mm:ss}\":{sum.Value}");
        else
          rdb.Put(key, $"{entry},\"{date:yyyy-MM-ddTHH:mm:ss}\":{sum.Value}");
      }
    }
  }
}
