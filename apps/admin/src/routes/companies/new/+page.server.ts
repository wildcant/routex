import { prisma } from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import { CompanyFormSchema, encode, handleCompanyError } from '../utils';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		try {
			const data = CompanyFormSchema.parse(formData);
			const hash = encode(data.name);
			await prisma.company.create({ data: { ...data, hash } });
		} catch (error) {
			return handleCompanyError(error);
		}

		throw redirect(303, '/companies');
	}
};
