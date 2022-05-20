using System.Threading.Tasks;
using CorpusExplorer.Sdk.Db.RocksDb;
using Tfres;

namespace IDS.Lexik.cOWIDplusViewer.v2.WebService.Exporter.Abstract
{
  public abstract class AbstractExporter
  {
    public abstract string Id { get; }
    public abstract void Convert(HttpContext arg, ref EasyRocksDb db, byte n, string[] requests);
  }
}
