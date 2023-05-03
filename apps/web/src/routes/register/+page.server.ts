import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { registerSchema } from './schema';
import bcrypt from 'bcrypt';
import omit from 'lodash/omit';

export const load: PageServerLoad = async () => {
  const form = await superValidate(registerSchema);
  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, registerSchema);

    if (!form.valid) return fail(400, { form });

    try {
      const user = await prisma.user.findUnique({
        where: { email: form.data.email },
        select: { id: true }
      });
      if (user) return setError(form, ['email'], 'This email is already registered.');

      const data = omit(form.data, ['password']);
      const password = bcrypt.hashSync(form.data.password, 10);
      await prisma.user.create({ data: { ...data, password } });
    } catch (error) {
      return setError(form, null, 'Something went wrong.');
    }

    throw redirect(303, '/welcome');
  }
};
