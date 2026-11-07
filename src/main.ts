import { NestFactory } from '@nestjs/core';
import {
  StandardSchemaValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';

import { AppModule } from './app.module.js';

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
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
