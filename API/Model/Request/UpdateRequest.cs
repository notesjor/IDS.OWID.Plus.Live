namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class UpdateRequest
  {
    public string SessionKey { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public int Day { get; set; }
    public string Data { get; set; }
  }
}
