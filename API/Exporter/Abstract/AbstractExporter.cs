using System.Threading.Tasks;
using Tfres;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Exporter.Abstract
{
  public abstract class AbstractExporter
  {
    public abstract string Id { get; }
    // TODO: public abstract void Convert(HttpContext arg, ref EasyRocksDb db, byte n, string[] requests);
  }
}
