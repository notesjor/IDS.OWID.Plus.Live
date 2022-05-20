using System;
using System.Collections.Generic;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Json.OwidLiveStorage
{
  public class OwidLiveStorageTimeItem
  {
    public string Key { get; set; }
    public string[] Token { get; set; }
    public string Name { get; set; }
    public Dictionary<DateTime, double> Dates { get; set; }
    public bool IsSelected { get; set; }
  }
}