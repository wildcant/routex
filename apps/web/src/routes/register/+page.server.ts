import { NODE_ENV } from '$env/static/private';
import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import omit from 'lodash/omit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { registerSchema } from './schema';
import { Prisma } from 'database/server';

export const load: PageServerLoad = async () => {
  const form = await superValidate(registerSchema);
  return { form };
};

export const actions: Actions = {
  default: async ({ request, url, cookies }) => {
    // Check form is valid.
    const form = await superValidate(request, registerSchema);
    if (!form.valid) return fail(400, { form });

    // Check company from search params exist.
    const companyId = url.searchParams.get('company');
    const verifyCompanyRedirectUrl =
      '/verify-company?error=Please%20verify%20your%20company%20in%20order%20to%20register.';
    if (!companyId) {
      throw redirect(303, verifyCompanyRedirectUrl);
    }
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw redirect(303, verifyCompanyRedirectUrl);
    }

    try {
      // Check if email already exist.
      const emailExist = await prisma.user.findUnique({
        where: { email: form.data.email },
        select: { id: true }
      });
      if (emailExist) return setError(form, ['email'], 'This email is already registered.');

      // Hash password.
      const data = omit(form.data, ['password']);
      const password = bcrypt.hashSync(form.data.password, 10);

      await prisma.user.create({ data: { ...data, password, companyId } });
    } catch (error) {
      let errorMessage = 'Something went wrong.';

      if (NODE_ENV === 'development') {
        if (error instanceof Error) errorMessage += ' ' + error.message;
      } else {
        errorMessage += ' Please contact an admin.';
      }

      return setError(form, null, errorMessage);
    }

    throw redirect(303, '/welcome');
  }
};
