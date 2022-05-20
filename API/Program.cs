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
      var service = new CowidPlusWebService();
      service.Start();
    }
  }
}
