import { authenticateUser } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

const privateUserRoutes = ['/find'];
const privateAdminRoutes = ['/admin'];
const privateRoutes = [...privateUserRoutes, ...privateAdminRoutes];

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = authenticateUser(event);

  const isPrivateRoute = privateRoutes.some((privateRoute) =>
    event.url.pathname.startsWith(privateRoute)
  );
  if (isPrivateRoute) {
    if (!event.locals.user) {
      throw redirect(303, '/login');
    }

    const isAdminRoute = privateAdminRoutes.some((privateAdminRoute) =>
      event.url.pathname.startsWith(privateAdminRoute)
    );
    if (isAdminRoute && event.locals.user.role !== 'ADMIN') {
      throw redirect(303, '/find');
    }
  }

  const response = await resolve(event);
  return response;
};
