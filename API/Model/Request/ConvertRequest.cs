using IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Json.OwidLiveStorage;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class CowidPlusDownRequest
  {
    public string Format { get; set; }
    public byte N { get; set; }
    public string[] Requests { get; set; }
  }
}
