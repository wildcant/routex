import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '../schema';
import { handleSaveUserError } from '../utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(userSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, userSchema);
		if (!form.valid) return fail(400, { form });
		try {
			await prisma.user.create({ data: form.data });
		} catch (error) {
			return handleSaveUserError({ error, form });
		}

		throw redirect(303, '/users');
	}
};
