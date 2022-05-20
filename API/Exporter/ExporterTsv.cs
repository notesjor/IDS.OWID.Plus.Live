using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;
using CorpusExplorer.Sdk.Db.RocksDb;
using IDS.Lexik.cOWIDplusViewer.v2.WebService.Exporter.Abstract;
using Newtonsoft.Json;
using Tfres;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Exporter
{
  public class ExporterTsv : AbstractExporter
  {
    private CultureInfo _format = new CultureInfo("en-US");
    public override string Id => "TSV";

    public override void Convert(HttpContext arg, ref EasyRocksDb db, byte n, string[] requests)
    {
      if (requests.Length > 10000)
      {
        arg.Response.Send("too many requests");
        return;
      }

      var norm = JsonConvert.DeserializeObject<Dictionary<DateTime, double>>(db.Get($">{n}")+"}");

      arg.Response.SendChunk("N\tWortform\tLemma\tPOS\tDatum\tFrequenz\tFrequenz (rel.)\r\n", Encoding.UTF8);
      foreach (var request in requests)
      {
        var ts = db.Get(request);
        if (string.IsNullOrEmpty(ts))
          continue;

        var wlp = request.Split(new[] {"µ"}, StringSplitOptions.RemoveEmptyEntries);
        var key = $"{n}\t{wlp[0]}\t{wlp[1]}\t{wlp[2]}\t";

        var dates = JsonConvert.DeserializeObject<Dictionary<DateTime, double>>(ts + "}");
        foreach (var date in dates)
          arg.Response.SendChunk($"{key}{date.Key:yyyy-MM-dd}\t{date.Value.ToString(_format)}\t{(date.Value / norm[date.Key] * 1000000.0).ToString(_format)}\r\n", Encoding.UTF8);
      }

      arg.Response.SendFinalChunk();
    }
  }
}
