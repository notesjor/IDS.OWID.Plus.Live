using System;
using System.Globalization;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class SearchRequest
  {
    public byte N { get; set; }
    public SearchRequestItem[] Items { get; set; }
    public string From { get; set; }
    public string To { get; set; }

    public DateTime FromDate => DateTime.ParseExact(From, "yyyy-MM-dd", CultureInfo.InvariantCulture);
    public int Year => FromDate.Year;
  }
}
