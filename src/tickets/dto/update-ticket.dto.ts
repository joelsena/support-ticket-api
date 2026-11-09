import z from 'zod';

import { createTicketSchema } from './create-ticket.dto.js';

// TODO: validate when empty param
export const updateTicketSchema = createTicketSchema.partial();

export type UpdateTicketDTO = z.infer<typeof updateTicketSchema>;
