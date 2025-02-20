namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class SearchRequestItem
  {
    public byte Position { get; set; }
    public byte Layer { get; set; }
    public string Token { get; set; }

    public string Query
      => $"µ{(string.IsNullOrWhiteSpace(Token) ? "*" : Token)}µ";

    public string[] Fields
      => new[] {$"{(Layer == 0 ? "w" : Layer == 1 ? "l" : "p")}{Position}"};
  }
}