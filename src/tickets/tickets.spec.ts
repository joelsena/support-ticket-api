import { Test } from '@nestjs/testing';

import { TicketsService } from './tickets.service.js';
import { StoreModule } from '../store/store.module.js';

describe('TicketsService', () => {
  let ticketsService: TicketsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [StoreModule],
      providers: [TicketsService],
    }).compile();

    ticketsService = moduleRef.get(TicketsService);
  });

  it('should handle tickets filters correctly', () => {
    ticketsService.create({
      title: 'test 1',
      description: 'test',
      priority: 'LOW',
      status: 'IN_PROGRESS',
    });

    ticketsService.create({
      title: 'test 2',
      description: 'test',
      priority: 'LOW',
      status: 'IN_PROGRESS',
    });

    ticketsService.create({
      title: 'test 3',
      description: 'test',
      priority: 'LOW',
      status: 'OPEN',
    });

    expect(
      ticketsService.findMany({
        priority: 'LOW',
        status: 'IN_PROGRESS',
        page: 1,
        limit: 5,
      }),
    ).toEqual(
      expect.objectContaining({
        data: [
          expect.objectContaining({ title: 'test 1' }),
          expect.objectContaining({ title: 'test 2' }),
        ],
      }),
    );
  });
});
