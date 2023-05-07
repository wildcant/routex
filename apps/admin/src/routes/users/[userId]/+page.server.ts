import { fetchCompaniesNames } from '$lib/server/companies';
import { prisma } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import omit from 'lodash/omit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '../schema';
import { handleSaveUserError } from '../utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const user = await prisma.user.findUnique({ where: { id: params.userId } });
	if (!user) throw error(404, 'User Not found');
	const form = await superValidate(user, userSchema);
	return { form, companies: await fetchCompaniesNames() };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, userSchema);
		if (!form.valid) return fail(400, { form });

		const user = await prisma.user.findUnique({
			where: { email: form.data.email },
			select: { password: true }
		});
		if (!user) throw setError(form, null, 'User not found');

		// If password was updated we must encrypt it again.
		let password = form.data.password;
		if (form.data.password !== user.password) {
			password = bcrypt.hashSync(form.data.password, 10);
		}

		try {
			const data = omit(form.data, ['password']);
			await prisma.user.update({
				where: { id: params.userId },
				data: { ...data, password }
			});
		} catch (error) {
			return handleSaveUserError({ error, form });
		}

		throw redirect(303, '/users');
	}
};
