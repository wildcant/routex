import { fetchCompaniesNames } from '$lib/server/company';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import omit from 'lodash/omit';
import { superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '../schema';
import { handleSaveUserError } from '../utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(userSchema);
	return { form, companies: await fetchCompaniesNames() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, userSchema);
		if (!form.valid) return fail(400, { form });

		try {
			const data = omit(form.data, ['password']);
			const password = bcrypt.hashSync(form.data.password, 10);
			await prisma.user.create({ data: { ...data, password } });
		} catch (error) {
			return handleSaveUserError({ error, form });
		}

		throw redirect(303, '/users');
	}
};
