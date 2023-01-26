using NSwag;

var localPath = Directory.GetCurrentDirectory();

if (!Path.Exists(Path.Combine(localPath, "Program.cs")))
{
    localPath = Path.Combine(localPath, "../..");
}

var spec = Path.Combine(localPath, "../../../specs/draft-v1_providers.json");

var document = OpenApiDocument.FromJsonAsync(File.ReadAllText(spec));