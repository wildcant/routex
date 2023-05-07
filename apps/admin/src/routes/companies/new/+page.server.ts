import { generateHashFor, prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { companySchema } from '../schema';
import { handleSaveCompanyError } from '../utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(companySchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, companySchema);
		if (!form.valid) return fail(400, { form });
		try {
			const hash = generateHashFor(form.data.name);
			await prisma.company.create({ data: { ...form.data, hash } });
		} catch (error) {
			return handleSaveCompanyError({ error, form });
		}

		throw redirect(303, '/companies');
	}
};
