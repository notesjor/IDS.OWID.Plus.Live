using Newtonsoft.Json;

namespace IDS.OWIDplusLIVE.API.Model.Json.OwidLiveStorage
{
  public class OwidLiveNormData
  {
    [JsonProperty("t")]
    public long Token { get; set; }
    [JsonProperty("s")]
    public long Sentences { get; set; }
  }
}
