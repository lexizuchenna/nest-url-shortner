import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { env } from 'env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1', {
    exclude: [{ method: RequestMethod.GET, path: '/r/:id' }],
  });

  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API for shortening URLs and managing users')
    .setVersion('1.0')
    .addTag('URL')
    .addTag('User')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(env.PORT);

  new Logger().log(`Server listening on port ${env.PORT}`);
}
bootstrap();
