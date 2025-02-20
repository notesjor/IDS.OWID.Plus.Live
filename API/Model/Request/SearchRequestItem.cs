namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class SearchRequestItem
  {
    public byte Position { get; set; }
    public byte Layer { get; set; }
    public string Token { get; set; }
    public string LayerDisplayname => Layer == 0 ? "Wort" : Layer == 1 ? "Lemma" : "POS";
  }
}