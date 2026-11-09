import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Query,
  HttpStatus,
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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'create ticket' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  createTicket(
    @Body({ schema: createTicketSchema }) ticketDTO: CreateTicketDTO,
  ) {
    return this.ticketsService.create(ticketDTO);
  }

  @Get()
  @ApiOperation({ summary: 'list tickets' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated and filtered tickets',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  findMany(@Query({ schema: listTicketsQuerySchema }) query: ListTicketDTO) {
    // TODO: return valid type
    return this.ticketsService.findMany(query) as {};
  }

  @Get(':id')
  @ApiOperation({ summary: 'return ticket by id' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  findOne(@Param('id', { schema: z.uuid() }) id: string) {
    // TODO: return valid type
    return this.ticketsService.findUnique(id) as {};
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update ticket' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  updateTicket(
    @Param('id', { schema: z.uuid() }) id: string,
    @Body({ schema: updateTicketSchema }) ticket: UpdateTicketDTO,
  ) {
    return this.ticketsService.update(id, ticket) as {};
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete ticket' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation failed',
  })
  deleteTicket(@Param('id', { schema: z.uuid() }) id: string) {
    return this.ticketsService.delete(id) as {};
  }
}
