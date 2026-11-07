import z from 'zod';

import { createTicketSchema } from './create-ticket.dto.js';

export const updateTicketSchema = createTicketSchema.partial();

export type UpdateTicketDTO = z.infer<typeof updateTicketSchema>;
