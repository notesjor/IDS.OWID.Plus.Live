using System;
using IDS.Lexik.WebService.Sdk.WebService.Configuration;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Model.Configuration
{
  public class ServiceConfiguration : EasyWebServiceConfiguration
  {
    public int N { get; set; } = 5;
    public int MaxItems { get; set; } = 1000;
    public long MaxPostSize { get; set; } = 50 * 1024 * 1024;
    public string SecureUpdateToken { get; set; } = Guid.NewGuid().ToString("N");
  }
}
