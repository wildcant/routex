import { Prisma, prisma } from '$lib/server/prisma';
import type { Validation } from 'sveltekit-superforms';
import { setError } from 'sveltekit-superforms/server';
import type { UserSchema } from './schema';

type HandleSaveUserErrorArgs = {
	error: unknown;
	form: Validation<UserSchema>;
};

/** Customize db errors messages to improve ux. */
export const handleSaveUserError = async ({ error, form }: HandleSaveUserErrorArgs) => {
	if (await prisma.user.findUnique({ where: { email: form.data.email } })) {
		return setError(form, 'email', 'A user with this email already exist.');
	}

	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return setError(form, null, error.message);
	}

	return setError(form, null, 'Something went wrong');
};
