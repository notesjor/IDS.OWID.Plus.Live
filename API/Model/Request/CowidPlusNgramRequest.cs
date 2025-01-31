using System.Collections.Generic;

namespace IDS.OWIDplusLIVE.API.Model.Request
{
  public class CowidPlusNgramRequest
  {
    public List<Dictionary<string, string>> Query { get; set; }
  }
}
