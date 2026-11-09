import {
  HttpStatus,
  INestApplication,
  StandardSchemaValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { TicketsService } from '../src/tickets/tickets.service.js';
import { AppModule } from '../src/app.module.js';

describe('Tickets E2E', () => {
  let app: INestApplication;
  let ticketsService = {
    findUnique: () => ({
      title: 'test',
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TicketsService)
      .useValue(ticketsService)
      .compile();

    app = moduleRef.createNestApplication();

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
    await app.init();
  });

  // TODO: use actual classes without mocking

  it('should throws error when given invalid query', async () => {
    return request(app.getHttpServer())
      .get('/tickets')
      .query({ page: 0, limit: -2 })
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect({
        message: 'Validation failed',

        errors: [
          { path: 'page', message: 'Too small: expected number to be >0' },
          { path: 'limit', message: 'Too small: expected number to be >0' },
        ],
      });
  });

  it('should returns tickets correctly', () => {
    return request(app.getHttpServer())
      .get('/tickets/2c732344-eed1-426d-ac7a-33ede463e7d3')
      .expect(200)
      .expect(ticketsService.findUnique());
  });

  afterAll(async () => await app.close());
});
