import { Role } from 'database/client';
import { z } from 'zod';

export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export const sanitizedUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  companyId: z.string()
});

export type SanitizedUser = z.infer<typeof sanitizedUser>;
