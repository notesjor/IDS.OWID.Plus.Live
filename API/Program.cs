using IDS.Lexik.WebService.Sdk.WaitBehaviour;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService
{
  class Program
  {
    static void Main(string[] args)
    {
      AppDomain.CurrentDomain.UnhandledException += (sender, e) =>
      {
        var ex = e.ExceptionObject as Exception;
        if (ex != null)
        {
          Console.WriteLine(ex.Message);
          Console.WriteLine(ex.StackTrace);
        }
      };

      if(args.Length == 1 && args[0] == "/WAIT")
        Console.ReadLine();

      var service = new CowidPlusWebService();
      service.Start();
    }
  }
}
