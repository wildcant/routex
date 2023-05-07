import { prisma } from '$lib/server/prisma';

export const load = async () => {
	return { users: await prisma.user.findMany() };
};
