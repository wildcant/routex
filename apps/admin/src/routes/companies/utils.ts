import { Prisma } from '$lib/prisma';
import type { Validation } from 'sveltekit-superforms';
import { setError } from 'sveltekit-superforms/server';
import type { CompanySchema } from './schema';

export const encode = (str: string) => Buffer.from(str).toString('base64');
// const decode = (code: string) => Buffer.from(code, 'base64').toString();

type HandleSaveCompanyErrorArgs = {
	error: unknown;
	form: Validation<CompanySchema>;
};
export const handleSaveCompanyError = async ({ error, form }: HandleSaveCompanyErrorArgs) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return setError(form, null, error.message);
	}

	return setError(form, null, 'Something went wrong');
};
