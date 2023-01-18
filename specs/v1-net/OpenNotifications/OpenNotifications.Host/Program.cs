using NSwag.Generation.Processors;
using OpenNotifications.Controllers;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IOperationProcessor, ErrorDtoProcessor>();

builder.Services.AddMvc()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(options =>
{
    options.Title = "Open Notfication Host";
});

var app = builder.Build();

app.UseOpenApi();
app.UseReDoc();

app.MapControllers();

app.Run();
