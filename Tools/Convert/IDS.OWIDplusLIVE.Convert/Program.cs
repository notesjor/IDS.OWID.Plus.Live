using CorpusExplorer.Sdk.Ecosystem;
using CorpusExplorer.Sdk.Helper;
using CorpusExplorer.Sdk.Utils.DocumentProcessing.Cleanup;
using System.Text;
using CorpusExplorer.Sdk.Utils.DocumentProcessing.Tagger.TreeTagger;

namespace IDS.OWIDplusLIVE.Convert
{
  internal class Program
  {
    static void Main(string[] args)
    {
      if (args.Length != 2)
      {
        Console.WriteLine("Usage: IDS.OWIDplusLIVE.Convert <input folder> <output file>");
        return;
      }

      CorpusExplorerEcosystem.InitializeMinimal();

      var folder = args[0];
      var output = args[1];

      var clean01 = new StandardCleanup();
      clean01.Input.Enqueue(Directory.GetFiles(folder, "*.txt")
        .Select(f =>
          new Dictionary<string, object> {
            { "D", Path.GetFileNameWithoutExtension(f) },
            { "Text", File.ReadAllText(f, Encoding.UTF8) } 
          }
        ));
      clean01.Execute();

      var clean02 = new RegexXmlMarkupCleanup { Input = clean01.Output };
      clean02.Execute();

      var tagger = new SimpleTreeTagger { Input = clean02.Output, LanguageSelected = "Deutsch" };
      tagger.Execute();
      tagger.Output.First().Save(output, false);
    }
  }
}
