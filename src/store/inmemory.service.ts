import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    next: boolean;
    back: boolean;
  };
};

type GenericItem = {
  id: string;
  createdAt: Date;
};

@Injectable()
export class InMemoryService {
  private readonly store: Record<string, Record<string, any>> = {};

  findUnique<T extends GenericItem>(
    tableName: string,
    predicate: (item: T) => boolean,
  ): T | undefined {
    if (!this.store[tableName]) return undefined;

    const item = Object.values(this.store[tableName]).find((item: T) =>
      predicate(item),
    );

    return item;
  }

  findMany<T extends GenericItem>(
    tableName: string,
    predicate: (item: T) => boolean,
    pagination?: { page: number; limit: number },
  ): PaginatedResult<T> {
    if (!this.store[tableName])
      return {
        data: [],
        meta: {
          back: false,
          next: false,
          limit: 5,
          page: 1,
          total: 0,
          totalPages: 0,
        },
      };

    const items = Object.values(this.store[tableName]);

    const filteredItems = items.filter((item: T) => predicate(item));

    const { page = 1, limit = 5 } = pagination || {};

    const pageStart = (page - 1) * limit;
    const pageEnd = pageStart + limit;
    const paginatedItems = filteredItems.slice(pageStart, pageEnd);

    const totalPages = Math.ceil(filteredItems.length / limit);

    const responseMetadata = {
      data: paginatedItems,
      meta: {
        page,
        limit,
        total: filteredItems.length,
        totalPages,
        next: page < totalPages,
        back: page > 1,
      },
    };

    return responseMetadata;
  }

  create(tableName: string, data: any) {
    const id = crypto.randomUUID();

    if (!this.store[tableName]) this.store[tableName] = {};

    this.store[tableName][id] = {
      ...data,
      id,
      createdAt: new Date(),
    };
  }

  update<T extends GenericItem>(
    tableName: string,
    predicate: (item: T) => boolean,
    data: any,
  ) {
    const item = Object.values(this.store[tableName]).find((item) =>
      predicate(item),
    ) as T;

    if (!item) return;

    this.store[tableName][item.id] = {
      ...this.store[tableName][item.id],
      ...data,
    };

    return item;
  }

  delete<T extends GenericItem>(
    tableName: string,
    predicate: (item: T) => boolean,
  ) {
    const item = Object.values(this.store[tableName]).find((item) =>
      predicate(item),
    ) as T;

    if (!item) return;

    delete this.store[tableName][item.id];

    return item;
  }
}
