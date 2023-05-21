import { NODE_ENV } from '$env/static/private';
import { JWT_COOKIE_KEY, generateUserToken } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import pick from 'lodash/pick';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from './schema';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(303, locals.user.role === 'ADMIN' ? '/admin' : '/find');
  }

  const form = await superValidate(loginSchema);
  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, loginSchema);
    if (!form.valid) return fail(400, { form });

    let user;

    try {
      user = await prisma.user.findUnique({
        where: { email: form.data.email }
      });
      if (!user) return setError(form, null, 'Invalid email or password.');

      const passwordMatched = await bcrypt.compare(form.data.password, user.password ?? '');
      if (!passwordMatched) return setError(form, null, 'Invalid email or password.');

      if (user.status === 'PENDING') return setError(form, null, `You're account is under review.`);

      const { expires, token } = await generateUserToken(
        pick(user, ['id', 'name', 'email', 'role', 'companyId'])
      );

      cookies.set(JWT_COOKIE_KEY, token, {
        path: '/',
        sameSite: 'strict',
        secure: NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        expires: new Date(expires)
      });
    } catch (error) {
      return setError(form, null, 'Something went wrong.');
    }

    throw redirect(303, user.role === 'ADMIN' ? '/admin' : '/find');
  }
};
