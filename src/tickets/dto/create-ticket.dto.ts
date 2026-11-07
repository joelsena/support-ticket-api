import z from 'zod';

export const createTicketSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export type CreateTicketDTO = z.infer<typeof createTicketSchema>;
