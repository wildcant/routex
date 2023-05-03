import z from 'zod';
import { Role } from 'database/client';

export const userSchema = z.object({
	name: z.string().min(1, { message: 'This field is required.' }),
	email: z.string().email(),
	role: z.nativeEnum(Role).default(Role.USER)
});

export type UserSchema = typeof userSchema;
export type IUserSchema = z.infer<typeof userSchema>;
