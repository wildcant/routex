import { generateHashFor, prisma } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { companySchema } from '../schema';
import { handleSaveCompanyError } from '../utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const company = await prisma.company.findUnique({ where: { id: params.companyId } });
	if (!company) throw error(404, 'Company Not found');
	const form = await superValidate(company, companySchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, companySchema);
		if (!form.valid) return fail(400, { form });

		try {
			const hash = generateHashFor(form.data.name);
			await prisma.company.update({
				where: { id: params.companyId },
				data: { ...form.data, hash }
			});
		} catch (error) {
			return handleSaveCompanyError({ error, form });
		}

		throw redirect(303, '/companies');
	}
};
