import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { companyHashSchema } from './schema';

export const load: PageServerLoad = async ({ url }) => {
  const form = await superValidate(companyHashSchema);

  return { form, error: url.searchParams.get('error') };
};
export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, companyHashSchema);
    if (!form.valid) return fail(400, { form });
    let company;
    try {
      company = await prisma.company.findUnique({ where: { hash: form.data.hash } });
      if (!company) {
        return setError(form, null, `This company doesn't exist in our database.`);
      }
    } catch (error) {
      return setError(form, null, 'Something went wrong.');
    }

    throw redirect(303, `/register?company=${company.id}`);
  }
};
