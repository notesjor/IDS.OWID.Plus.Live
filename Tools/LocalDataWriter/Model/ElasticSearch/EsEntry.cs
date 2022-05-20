using System.Collections.Generic;
using Nest;

namespace IDS.Lexik.cOWIDplusViewer.v2.DataWriter.Model
{
  [ElasticsearchType(IdProperty = nameof(Key), Name = "ese")]
  public sealed class EsEntry
  {
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string Key { get; set; }
    [Number(NumberType.Byte, Name = "n", IgnoreMalformed = true)]
    public byte N { get; set; }

    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string W0 { get; set; }
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string W1 { get; set; }
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string W2 { get; set; }
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string L0 { get; set; }
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string L1 { get; set; }
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string L2 { get; set; }
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string P0 { get; set; }
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string P1 { get; set; }
    [Keyword(Norms = false, Index = false, Normalizer = "")]
    public string P2 { get; set; }
  }
}
