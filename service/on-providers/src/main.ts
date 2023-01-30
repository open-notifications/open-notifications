import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiErrorDto, ErrorCode } from './dtos';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Open Notifications')
    .setDescription('Open Notifications Host Service')
    .setVersion('1.0')
    .addTag('notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // https://stackoverflow.com/questions/73655199/nestjs-swagger-how-to-add-additionalproperties-false-on-an-existing-dto-clas
  const schemas = document?.components?.schemas;
  Object.keys(schemas).forEach((item) => {
    if (schemas[item]['properties']?.allowAdditional) {
      schemas[item]['additionalProperties'] = true;
    } else {
      schemas[item]['additionalProperties'] = false;
    }
  });

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = new ApiErrorDto();
        result.errors = [];

        function addError(error: ValidationError, path = '') {
          if (error.children?.length > 0) {
            const childPath = `${path}.${error.property}.`;

            for (const child of error.children) {
              addError(child, childPath);
            }
          }

          if (error.constraints) {
            const field = `${path}.${error.property}`;

            for (const message of Object.values(error.constraints)) {
              result.errors.push({
                message,
                code: ErrorCode.VALIDATION_ERROR,
                field,
              });
            }
          }
        }

        for (const error of errors) {
          addError(error);
        }

        return result;
      },
    }),
  );

  await app.listen(4500);
}
bootstrap();
