namespace IDS.OWIDplusLIVE.API.Helper
{
    public static class CachePathHelper
    {
      public static string GetDirectory(string basePath, int n, string hash) => $"{basePath}/{n}-{hash}";
    }
}
