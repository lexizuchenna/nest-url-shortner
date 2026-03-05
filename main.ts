import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { env } from 'env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT);
  new Logger().log(`Server listening on port ${env.PORT}`);
}
bootstrap();
