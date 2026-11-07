import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

import { TicketsService } from './tickets.service.js';
import {
  type CreateTicketDTO,
  createTicketSchema,
} from './dto/create-ticket.dto.js';
import {
  updateTicketSchema,
  type UpdateTicketDTO,
} from './dto/update-ticket.dto.js';
import z from 'zod';
import {
  type ListTicketDTO,
  listTicketsQuerySchema,
} from './dto/list-tickets-query.dto.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  createTicket(
    @Body({ schema: createTicketSchema }) ticketDTO: CreateTicketDTO,
  ) {
    return this.ticketsService.create(ticketDTO);
  }

  @Get()
  findMany(@Query({ schema: listTicketsQuerySchema }) query: ListTicketDTO) {
    return this.ticketsService.findMany(query) as {};
  }

  @Get(':id')
  findOne(@Param('id', { schema: z.uuid() }) id: string) {
    return this.ticketsService.findUnique(id) as {};
  }

  @Patch(':id')
  updateTicket(
    @Param('id', { schema: z.uuid() }) id: string,
    @Body({ schema: updateTicketSchema }) ticket: UpdateTicketDTO,
  ) {
    this.ticketsService.update(id, ticket);
  }

  @Delete(':id')
  deleteTicket(@Param('id', { schema: z.uuid() }) id: string) {
    this.ticketsService.delete(id);
  }
}
