import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from './schema';

export const load: PageServerLoad = async () => {
  const form = await superValidate(loginSchema);
  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, loginSchema);
    if (!form.valid) return fail(400, { form });

    try {
      const user = await prisma.user.findUnique({
        where: { email: form.data.email },
        select: { status: true, password: true }
      });
      if (!user) return setError(form, null, 'Invalid email or password.');

      const passwordMatched = await bcrypt.compare(form.data.password, user.password ?? '');
      if (!passwordMatched) return setError(form, null, 'Invalid email or password.');

      if (user.status === 'PENDING') return setError(form, null, `You're account is under review.`);
    } catch (error) {
      return setError(form, null, 'Something went wrong.');
    }

    throw redirect(303, '/');
  }
};
