import { fail } from '@sveltejs/kit';
import { Prisma } from 'database';
import z from 'zod';

export const CompanyFormSchema = z.object({
	name: z.string().min(1)
});

export type CompanyFormData = z.infer<typeof CompanyFormSchema>;
export const encode = (str: string) => Buffer.from(str).toString('base64');
// const decode = (code: string) => Buffer.from(code, 'base64').toString();

export const handleCompanyError = (error: unknown) => {
	if (error instanceof z.ZodError) {
		const err: z.ZodError<CompanyFormData> = error;
		const errors = err.flatten().fieldErrors;

		return fail(400, {
			errorMessage: 'Validation error',
			error: undefined,
			errors
		});
	}
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === 'P2002') {
			return fail(400, {
				errorMessage: 'There was a problem saving the company. Please review the errors below.',
				error: error.message,
				errors: undefined
			});
		}
	}
	return fail(400, {
		errorMessage: 'Something went wrong',
		error: undefined,
		errors: undefined
	});
};
