import { Injectable, NotFoundException } from '@nestjs/common';
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
    const item = Object.values(this.store[tableName]).find((item: T) =>
      predicate(item),
    );

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  findMany<T>(
    tableName: string,
    predicate: (item: T) => boolean,
    pagination: { page: number; limit: number },
  ): PaginatedResult<T> {
    const items = Object.values(this.store[tableName]);

    const filteredItems = items.filter((item: T) => predicate(item));

    const { page, limit } = pagination;

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

    if (!item) {
      throw new NotFoundException();
    }

    this.store[tableName][item.id] = {
      ...this.store[tableName][item.id],
      ...data,
    };
  }

  delete<T>(tableName: string, predicate: (item: T) => boolean) {
    const item = Object.values(this.store[tableName]).find((item) =>
      predicate(item),
    );

    if (!item) {
      throw new NotFoundException();
    }

    delete this.store[tableName][item.id];
  }
}
