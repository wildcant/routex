import { JWT_COOKIE_KEY } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete(JWT_COOKIE_KEY);
  throw redirect(303, '/');
};
