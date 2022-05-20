using System.Linq;
using System.Text;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class CowidPlusFindRequest
  {
    public byte N { get; set; }
    public CowidPlusFindRequestItem[] Items { get; set; }
  }
}
