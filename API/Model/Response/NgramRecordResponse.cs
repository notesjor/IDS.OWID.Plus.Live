using System;
using System.Collections.Generic;

namespace IDS.OWIDplusLIVE.API.Model.Response
{
  public class NgramRecordResponse
  {
    public string[] Wordform { get; set; }
    public string[] Lemma { get; set; }
    public string[] Pos { get; set; }
    public Dictionary<string, double> Dates { get; set; }
    public bool IsSelected { get; set; }
  }
}
