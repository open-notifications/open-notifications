import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
