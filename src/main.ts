import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { config } from './shared/configs/config';
import { syncSchema } from './shared/scripts/sync-schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  // 1. build swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Category API')
    .setDescription('API для работы с категориями')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // 2. sync database schema
  await syncSchema();

  await app.listen(config.server.port);
}

bootstrap();
