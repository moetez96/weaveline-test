import { ValidationPipe } from '@nestjs/common';
import {  NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Notes list')
    .setDescription('The notes list API description')
    .setVersion('1.0')
    .addBearerAuth({type: "http", scheme: "bearer", bearerFormat: "Bearer"}, 'accessToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
