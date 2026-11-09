import { InMemoryService } from './inmemory.service.js';

describe('Store Tests', () => {
  let service: InMemoryService;

  beforeEach(() => {
    service = new InMemoryService();
  });

  it('should create a record and return correctly', () => {
    service.create('test', {
      name: 'john',
    });

    expect(
      service.findUnique<any>('test', (item) => item.name === 'john'),
    ).toEqual(expect.objectContaining({ name: 'john' }));
  });

  it('findMany should return paginated and filtered data', () => {
    service.create('test', {
      name: 'john 1',
      role: 'supervisor',
    });
    service.create('test', {
      name: 'john 2',
      role: 'supervisor',
    });
    service.create('test', {
      name: 'john 3',
      role: 'regular',
    });

    expect(
      service.findMany<any>('test', (item) => item.role === 'supervisor'),
    ).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'john 1' }),
          expect.objectContaining({ name: 'john 2' }),
        ]),
        meta: {
          page: 1,
          limit: 5,
          total: 2,
          totalPages: 1,
          next: false,
          back: false,
        },
      }),
    );
  });

  it('should return proper pagination metadata when parameters exceeds', () => {
    service.create('test', {
      name: 'john 1',
      role: 'supervisor',
    });
    service.create('test', {
      name: 'john 2',
      role: 'supervisor',
    });
    service.create('test', {
      name: 'john 3',
      role: 'regular',
    });

    const expectedPage = 2;
    const expectedLimit = 10;

    const res = service.findMany<any>(
      'test',
      (item) => item.role === 'supervisor',
      {
        page: expectedPage,
        limit: expectedLimit,
      },
    );

    expect(res).toEqual(
      expect.objectContaining({
        data: [],
        meta: {
          page: expectedPage,
          limit: expectedLimit,
          total: 2,
          totalPages: 1,
          next: false,
          back: true,
        },
      }),
    );
  });

  it.todo('should pass in all pagination edge cases');

  it('should handle no matching resource', () => {
    expect(service.findMany('test', (item) => false)).toEqual(
      expect.objectContaining({ data: [] }),
    );
  });

  it('should update record correctly', () => {
    service.create('test', {
      name: 'john',
    });

    const expectedName = 'john atualizado';

    service.update<any>('test', (item) => item.name === 'john', {
      name: expectedName,
    });

    expect(
      service.findUnique<any>('test', (item) => item.name === expectedName),
    ).toEqual(expect.objectContaining({ name: expectedName }));
  });

  it('should delete record correctly', () => {
    service.create('test', {
      name: 'john',
    });

    service.delete<any>('test', (item) => item.name === 'john');

    expect(
      service.findUnique<any>('test', (item) => item.name === 'john'),
    ).toEqual(undefined);
  });
});
