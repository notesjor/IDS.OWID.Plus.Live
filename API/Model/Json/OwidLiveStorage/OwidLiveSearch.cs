using System.Collections.Generic;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Json.OwidLiveStorage
{
  public class OwidLiveSearch
  {
    public int N { get; set; }
    public string Key { get; set; }
    public List<OwidLiveSearchQuery> Request { get; set; }
    public List<OwidLiveStorageTimeItem> OwidLiveStorageTimeItems { get; set; }
    public bool IsSelected { get; set; }
  }
}