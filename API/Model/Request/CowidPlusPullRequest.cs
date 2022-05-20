using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Request
{
  public class CowidPlusPullRequest
  {
    public byte N { get; set; }
    public string[] Items { get; set; }
  }
}
