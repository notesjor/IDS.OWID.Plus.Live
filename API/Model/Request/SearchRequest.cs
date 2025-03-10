using System;
using System.Text.Json.Serialization;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class SearchRequest
  {
    public byte N { get; set; }
    public SearchRequestItem[] Items { get; set; }
    public int Year { get; set; }

    [JsonIgnore]
    public string Hash { get; set; }
  }
}
