namespace IDS.Lexik.cOWIDplusViewer.v2.DataWriter.Model.Csv
{
  public struct CsvEntry
  {
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
        var splits = line.Split('\t');
        return new CsvEntry
          (
           int.Parse(splits[3]),
           (byte) splits[0].Split(' ').Length,
           splits[0],
           splits[1],
           splits[2],
           string.Join("µ", splits[0], splits[1], splits[2])
           );
      }
      catch
      {
        return new CsvEntry();
      }
    }

    public string Key { get; }
    public int Frequency { get; }
    public byte N { get; }
    public string WordForm { get; }
    public string Lemma { get; }
    public string PosTag { get; }

    public EsEntry Step2_MakeEsEntry()
    {
      var ws = WordForm.Split(' ');
      var ls = Lemma.Split(' ');
      var ps = PosTag.Split(' ');

      switch (ws.Length)
      {
        case 1:
          return new EsEntry
          {
            Key = Key,
            N = N,

            W0 = $"µ{ws[0]}µ",
            L0 = $"µ{ls[0]}µ",
            P0 = $"µ{ps[0]}µ",
          };
        case 2:
          return new EsEntry
          {
            Key = Key,
            N = N,

            W0 = $"µ{ws[0]}µ",
            W1 = $"µ{ws[1]}µ",
            L0 = $"µ{ls[0]}µ",
            L1 = $"µ{ls[1]}µ",
            P0 = $"µ{ps[0]}µ",
            P1 = $"µ{ps[1]}µ",
          };
        case 3:
          return new EsEntry
          {
            Key = Key,
            N = N,

            W0 = $"µ{ws[0]}µ",
            W1 = $"µ{ws[1]}µ",
            W2 = $"µ{ws[2]}µ",
            L0 = $"µ{ls[0]}µ",
            L1 = $"µ{ls[1]}µ",
            L2 = $"µ{ls[2]}µ",
            P0 = $"µ{ps[0]}µ",
            P1 = $"µ{ps[1]}µ",
            P2 = $"µ{ps[2]}µ",
          };
      }

      return null;
    }
  }
}
