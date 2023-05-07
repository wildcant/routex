import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const response = await prisma.user.findMany();

	return { users: response };
}) satisfies PageServerLoad;
