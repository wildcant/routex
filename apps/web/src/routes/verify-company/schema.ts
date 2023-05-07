import { z } from 'zod';

export const companyHashSchema = z.object({
  hash: z.string().min(1, { message: 'Please enter your company hash.' })
});
