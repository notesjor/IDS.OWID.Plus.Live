using System;
using System.Collections.Generic;

namespace IDS.OWIDplusLIVE.API.Model.Response
{
  internal class NgramRecordResponse
  {
    public string[] Wordform { get; set; }
    public string[] Lemma { get; set; }
    public string[] Pos { get; set; }
    public Dictionary<DateTime, double> Dates { get; set; }
    public bool IsSelected { get; set; }
  }
}
