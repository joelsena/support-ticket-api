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

@Injectable()
export class InMemoryService {
  private readonly store: Record<string, Record<string, any>> = {};

  findUnique<T>(
    tableName: string,
    predicate: (item: T) => boolean,
  ): T | undefined {
    if (!this.store[tableName]) return undefined;

    const item = Object.values(this.store[tableName]).find((item: T) =>
      predicate(item),
    );

    return item;
  }

  findMany<T>(
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
    const pageEnd = pageStart + (limit - 1);
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

  update<T>(tableName: string, predicate: (item: T) => boolean, data: any) {
    const item = Object.values(this.store[tableName]).find((item) =>
      predicate(item),
    );

    if (!item) return false;

    this.store[tableName][item.id] = {
      ...this.store[tableName][item.id],
      ...data,
    };

    return true;
  }

  delete<T>(tableName: string, predicate: (item: T) => boolean) {
    const item = Object.values(this.store[tableName]).find((item) =>
      predicate(item),
    );

    if (!item) return false;

    delete this.store[tableName][item.id];

    return true;
  }
}
