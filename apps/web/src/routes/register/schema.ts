import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Please enter your name' }),
  email: z.string().email(),
  password: z.string().min(5, { message: 'Your password must contain at least 5 characters' })
});
