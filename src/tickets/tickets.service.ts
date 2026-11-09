import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTicketDTO } from './dto/create-ticket.dto.js';
import { UpdateTicketDTO } from './dto/update-ticket.dto.js';
import { InMemoryService } from '../store/inmemory.service.js';
import { ListTicketDTO } from './dto/list-tickets-query.dto.js';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  // updatedAt: Date
}

@Injectable()
export class TicketsService {
  constructor(private readonly inMemory: InMemoryService) {}

  create(ticket: CreateTicketDTO) {
    this.inMemory.create('tickets', ticket);
  }

  findMany({ priority, status, page, limit }: ListTicketDTO) {
    return this.inMemory.findMany<Ticket>(
      'tickets',
      (item) => {
        let condition = true;

        if (priority) condition &&= item.priority === priority;
        if (status) condition &&= item.status === status;

        return condition;
      },
      { page, limit },
    );
  }

  findUnique(ticketId: string) {
    const res = this.inMemory.findUnique<Ticket>(
      'tickets',
      (item) => item.id === ticketId,
    );

    if (!res) {
      throw new NotFoundException();
    }

    return res;
  }

  update(id: string, ticket: UpdateTicketDTO) {
    const res = this.inMemory.update<Ticket>(
      'tickets',
      (item) => item.id === id,
      ticket,
    );

    if (!res) {
      throw new NotFoundException();
    }

    return res;
  }

  delete(id: string) {
    const res = this.inMemory.delete<Ticket>(
      'tickets',
      (item) => item.id === id,
    );

    if (!res) {
      throw new NotFoundException();
    }

    return res;
  }
}
