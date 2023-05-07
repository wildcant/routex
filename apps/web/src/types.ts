import type { User } from 'database/client';
import { Role } from 'database/client';
import { z } from 'zod';

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const sanitizedUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role)
});

export type SanitizedUser = z.infer<typeof sanitizedUser>;
