using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDS.Lexik.cOWIDplusViewer.v2.DataWriter.Model.Csv
{
  public struct CsvEntry
  {
    public string Key { get; }

    public int Frequency { get; }

    public byte N { get; }

    public string WordForm { get; }

    public string Lemma { get; }

    public string PosTag { get; }

    private CsvEntry(string key = null)
    {
      Key = null;
      Frequency = 0;
      N = 0;
      WordForm = null;
      Lemma = null;
      PosTag = null;
    }

    private CsvEntry(int freq, byte n, string w, string l, string p, string key)
    {
      Frequency = freq;
      N = n;
      WordForm = w;
      Lemma = l;
      PosTag = p;
      Key = key;
    }

    public static CsvEntry Step1_ReadLine(string line)
    {
      try
      {
        string[] array = line.Split(new char[1] { '\t' });
        return new CsvEntry(int.Parse(array[3]), (byte)array[0].Split(new char[1] { ' ' }).Length, array[0], array[1], array[2], string.Join("µ", array[0], array[1], array[2]));
      }
      catch
      {
        return default(CsvEntry);
      }
    }

    public EsEntry Step2_MakeEsEntry()
    {
      string[] array = WordForm.Split(new char[1] { ' ' });
      string[] array2 = Lemma.Split(new char[1] { ' ' });
      string[] array3 = PosTag.Split(new char[1] { ' ' });
      return array.Length switch
      {
        1 => new EsEntry
        {
          Key = Key,
          N = N,
          W0 = "µ" + array[0] + "µ",
          L0 = "µ" + array2[0] + "µ",
          P0 = "µ" + array3[0] + "µ"
        },
        2 => new EsEntry
        {
          Key = Key,
          N = N,
          W0 = "µ" + array[0] + "µ",
          W1 = "µ" + array[1] + "µ",
          L0 = "µ" + array2[0] + "µ",
          L1 = "µ" + array2[1] + "µ",
          P0 = "µ" + array3[0] + "µ",
          P1 = "µ" + array3[1] + "µ"
        },
        3 => new EsEntry
        {
          Key = Key,
          N = N,
          W0 = "µ" + array[0] + "µ",
          W1 = "µ" + array[1] + "µ",
          W2 = "µ" + array[2] + "µ",
          L0 = "µ" + array2[0] + "µ",
          L1 = "µ" + array2[1] + "µ",
          L2 = "µ" + array2[2] + "µ",
          P0 = "µ" + array3[0] + "µ",
          P1 = "µ" + array3[1] + "µ",
          P2 = "µ" + array3[2] + "µ"
        },
        _ => null,
      };
    }
  }
}