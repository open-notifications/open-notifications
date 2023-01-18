using NSwag.Generation.Processors.Contexts;
using NSwag.Generation.Processors;
using OpenNotifications.Controllers.Dtos;
using NSwag;
using NJsonSchema;
using Namotion.Reflection;

namespace OpenNotifications.Controllers;

public sealed class ErrorDtoProcessor : IOperationProcessor
{
    public bool Process(OperationProcessorContext context)
    {
        var operation = context.OperationDescription.Operation;

        void AddResponse(string code, string description)
        {
            if (!IsErrorCode(code))
            {
                return;
            }

            if (!operation.Responses.ContainsKey(code))
            {
                operation.Responses.Add(code, new OpenApiResponse
                {
                    Description = description
                });
            }
        }

        AddResponse("404", "Resource not found.");
        AddResponse("4xx", "Client error.");
        AddResponse("5xx", "Server error.");

        foreach (var (code, response) in operation.Responses)
        {
            if (response.Schema == null)
            {
                if (IsErrorCode(code) && code != "404")
                {
                    response.Schema = GetErrorSchema(context);
                }
            }
        }
        return true;
    }

    private static bool IsErrorCode(string code)
    {
        return !code.StartsWith("2", StringComparison.OrdinalIgnoreCase);
    }

    private static JsonSchema GetErrorSchema(OperationProcessorContext context)
    {
        var errorType = typeof(ErrorsDto).ToContextualType();

        return context.SchemaGenerator.GenerateWithReference<JsonSchema>(errorType, context.SchemaResolver);
    }
}
