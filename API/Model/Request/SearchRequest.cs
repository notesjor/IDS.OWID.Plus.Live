using System.Linq;
using System.Text;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class SearchRequest
  {
    public byte N { get; set; }
    public SearchRequestItem[] Items { get; set; }
  }
}
