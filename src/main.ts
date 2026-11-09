import { NestFactory } from '@nestjs/core';
import {
  StandardSchemaValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';

import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      exceptionFactory: (issues) =>
        new UnprocessableEntityException({
          message: 'Validation failed',
          errors: issues.map((issue) => ({
            path: issue.path
              ?.map((segment) =>
                typeof segment === 'object' ? segment.key : segment,
              )
              .join('.'),
            message: issue.message,
          })),
        }),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Tickets API')
    .setDescription('API for managing tickets.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
