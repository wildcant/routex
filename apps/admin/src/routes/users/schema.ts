import z from 'zod';
import { Role, Status } from 'database/client';

export const userSchema = z.object({
	name: z.string().min(1, { message: 'This field is required' }),
	email: z.string().email(),
	role: z.nativeEnum(Role).default(Role.USER),
	password: z.string().min(1, { message: 'This field is required' }),
	status: z.nativeEnum(Status).default(Status.PENDING),
	companyId: z.string().length(11, { message: 'Select the user company' })
});

export type UserSchema = typeof userSchema;
export type IUserSchema = z.infer<typeof userSchema>;
