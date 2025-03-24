namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class LookupRequest
  {
    public string Query { get; set; }
    public int Layer { get; set; }
    public int Year { get; set; }
    public string LayerDisplayname => Layer == 0 ? "Wort" : Layer == 1 ? "Lemma" : "POS";
  }
}
