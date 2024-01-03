using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
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
      if (!client.Indices.Exists("entries").Exists)
      {
        client.Map((PutMappingDescriptor<EsEntry> x) => x.AutoMap());
        client.IndexDocument(new EsEntry
        {
          Key = "",
          N = 0
        });
      }
    }

    public static void InsertFromWebRequest(string data, DateTime date, ElasticClient es, Dictionary<byte, EasyRocksDb> rdbs)
    {
      Dictionary<string, CsvEntry> dictionary = new Dictionary<string, CsvEntry>();
      using (MemoryStream stream = new MemoryStream(Convert.FromBase64String(data)))
      {
        using GZipStream stream2 = new GZipStream(stream, CompressionMode.Decompress);
        using StreamReader streamReader = new StreamReader(stream2, Encoding.UTF8);
        streamReader.ReadLine();
        while (!streamReader.EndOfStream)
        {
          try
          {
            CsvEntry value = CsvEntry.Step1_ReadLine(streamReader.ReadLine());
            if (value.Frequency > 0)
            {
              dictionary.Add(value.Key, value);
            }
          }
          catch
          {
          }
        }
      }

      Insert(es, rdbs, dictionary, date);
    }

    public static void InsertFromFile(string fn, ElasticClient es, Dictionary<byte, EasyRocksDb> rdbs)
    {
      DateTime date = DateTime.ParseExact(Path.GetFileNameWithoutExtension(fn), "yyyy-MM-dd", CultureInfo.CurrentCulture);
      Dictionary<string, CsvEntry> dictionary = new Dictionary<string, CsvEntry>();
      using (FileStream stream = new FileStream(fn, FileMode.Open, FileAccess.Read, FileShare.Read))
      {
        using StreamReader streamReader = new StreamReader(stream, Encoding.UTF8);
        streamReader.ReadLine();
        while (!streamReader.EndOfStream)
        {
          try
          {
            CsvEntry value = CsvEntry.Step1_ReadLine(streamReader.ReadLine());
            if (value.Frequency > 0)
            {
              dictionary.Add(value.Key, value);
            }
          }
          catch
          {
          }
        }
      }

      Insert(es, rdbs, dictionary, date);
    }

    private static void Insert(ElasticClient es, Dictionary<byte, EasyRocksDb> rdbs, Dictionary<string, CsvEntry> items, DateTime date)
    {
      int num = 100;
      for (int i = 0; i < items.Count; i += num)
      {
        ProcessItems(es, rdbs, date, items.Values.Skip(i).Take(num).ToArray());
      }

      Dictionary<byte, long> dictionary = new Dictionary<byte, long>();
      foreach (KeyValuePair<string, CsvEntry> item in items)
      {
        if (dictionary.ContainsKey(item.Value.N))
        {
          dictionary[item.Value.N] += item.Value.Frequency;
        }
        else
        {
          dictionary.Add(item.Value.N, item.Value.Frequency);
        }
      }

      WriteSums(rdbs, date, dictionary);
      items.Clear();
      dictionary.Clear();
      GC.Collect();
    }

    private static void ProcessItems(ElasticClient es, Dictionary<byte, EasyRocksDb> rdbs, DateTime date, CsvEntry[] items)
    {
      try
      {
        Dictionary<string, int> itemDic = new Dictionary<string, int>();
        for (int i = 0; i < items.Length; i++)
        {
          itemDic.Add(items[i].Key, i);
        }

        IMultiGetHit<EsEntry>[] source = es.GetMany<EsEntry>(itemDic.Keys).ToArray();
        Console.WriteLine(string.Format(arg1: source.Count((IMultiGetHit<EsEntry> x) => x.Found), format: "> von {0} Einträgen existieren bereits {1}", arg0: items.Length));
        List<EsEntry> list = (from x in source
                              where !x.Found
                              select x into hit
                              select items[itemDic[hit.Id]].Step2_MakeEsEntry()).ToList();
        if (list.Count > 0)
        {
          es.IndexMany(list);
        }

        Parallel.ForEach(items, delegate (CsvEntry x)
        {
          EasyRocksDb easyRocksDb = rdbs[x.N];
          string text = easyRocksDb.Get(x.Key);
          if (text == null || string.IsNullOrEmpty(text))
          {
            easyRocksDb.Put(x.Key, $"{{\"{date:yyyy-MM-ddTHH:mm:ss}\":{x.Frequency}");
          }
          else
          {
            easyRocksDb.Put(x.Key, $"{text},\"{date:yyyy-MM-ddTHH:mm:ss}\":{x.Frequency}");
          }
        });
        itemDic.Clear();
      }
      catch
      {
      }
    }

    private static void WriteSums(Dictionary<byte, EasyRocksDb> rdbs, DateTime date, Dictionary<byte, long> sums)
    {
      foreach (KeyValuePair<byte, long> sum in sums)
      {
        EasyRocksDb easyRocksDb = rdbs[sum.Key];
        string key = $">{sum.Key}";
        string text = easyRocksDb.Get(key);
        if (text == null || string.IsNullOrEmpty(text))
        {
          easyRocksDb.Put(key, $"{{\"{date:yyyy-MM-ddTHH:mm:ss}\":{sum.Value}");
        }
        else
        {
          easyRocksDb.Put(key, $"{text},\"{date:yyyy-MM-ddTHH:mm:ss}\":{sum.Value}");
        }
      }
    }
  }
}