import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '../schema';
import { handleSaveUserError } from '../utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const user = await prisma.user.findUnique({ where: { id: parseInt(params.userId) } });
	if (!user) throw error(404, 'User Not found');
	const form = await superValidate(user, userSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, userSchema);
		if (!form.valid) return fail(400, { form });

		try {
			await prisma.user.update({
				where: { id: parseInt(params.userId) },
				data: form.data
			});
		} catch (error) {
			return handleSaveUserError({ error, form });
		}

		throw redirect(303, '/users');
	}
};
