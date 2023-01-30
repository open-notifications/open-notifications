// ==========================================================================
//  Open Notifications
// ==========================================================================
//  Copyright (c) Open Notifications
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using System.IO;
using NSwag;
using NSwag.CodeGeneration.CSharp;
using NSwag.CodeGeneration.OperationNameGenerators;

namespace CodeGenerator;

public static class Program
{
    public static void Main()
    {
        var document = OpenApiDocument.FromUrlAsync("http://localhost:4500/api-json").Result;

        GenerateCSharp(document);
    }

    private static void GenerateCSharp(OpenApiDocument document)
    {
        var generatorSettings = new CSharpClientGeneratorSettings
        {
            ExceptionClass = "OpenNotificationsException",
            GenerateOptionalParameters = true,
            GenerateClientInterfaces = true,
            GenerateBaseUrlProperty = true,
            OperationNameGenerator = new TagNameGenerator(),
            UseBaseUrl = false
        };

        generatorSettings.CSharpGeneratorSettings.ExcludedTypeNames = new[] { "JsonInheritanceConverter" };
        generatorSettings.CSharpGeneratorSettings.ArrayBaseType = "System.Collections.Generic.List";
        generatorSettings.CSharpGeneratorSettings.ArrayInstanceType = "System.Collections.Generic.List";
        generatorSettings.CSharpGeneratorSettings.ArrayType = "System.Collections.Generic.List";
        generatorSettings.CSharpGeneratorSettings.DictionaryBaseType = "System.Collections.Generic.Dictionary";
        generatorSettings.CSharpGeneratorSettings.DictionaryInstanceType = "System.Collections.Generic.Dictionary";
        generatorSettings.CSharpGeneratorSettings.DictionaryType = "System.Collections.Generic.Dictionary";
        generatorSettings.CSharpGeneratorSettings.Namespace = "OpenNotifications";
        generatorSettings.CSharpGeneratorSettings.GenerateNullableReferenceTypes = true;
        generatorSettings.CSharpGeneratorSettings.RequiredPropertiesMustBeDefined = false;
        generatorSettings.CSharpGeneratorSettings.TemplateDirectory = Directory.GetCurrentDirectory();

        var codeGenerator = new CSharpClientGenerator(document, generatorSettings);

        var code = codeGenerator.GenerateFile();

        File.WriteAllText(@"..\..\..\..\OpenNotifications\Generated.cs", code);
    }

    public sealed class TagNameGenerator : MultipleClientsFromOperationIdOperationNameGenerator
    {
        public override string GetClientName(OpenApiDocument document, string path, string httpMethod, OpenApiOperation operation)
        {
            if (operation.Tags?.Count == 1)
            {
                return operation.Tags[0];
            }

            return base.GetClientName(document, path, httpMethod, operation);
        }
    }
}
