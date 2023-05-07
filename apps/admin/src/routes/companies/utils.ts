import { Prisma } from '$lib/server/prisma';
import type { Validation } from 'sveltekit-superforms';
import { setError } from 'sveltekit-superforms/server';
import type { CompanySchema } from './schema';

type HandleSaveCompanyErrorArgs = {
	error: unknown;
	form: Validation<CompanySchema>;
};
export const handleSaveCompanyError = async ({ error, form }: HandleSaveCompanyErrorArgs) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return setError(form, null, error.message);
	}
	console.error(error);
	return setError(form, null, 'Something went wrong');
};
