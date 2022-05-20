using System;
using System.Collections.Generic;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Json.OwidLiveStorage
{
  public class OwidLiveStorage
  {
    public int N { get; set; }
    public Dictionary<string, OwidLiveSearch> OwidLiveSearches { get; set; }
    public Dictionary<DateTime, double>[] Norm { get; set; }
    public List<double> Total { get; set; }
    public List<double> NormTotal { get; set; }
  }
}
