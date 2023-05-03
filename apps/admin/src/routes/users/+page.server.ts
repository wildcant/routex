import { prisma } from '$lib/prisma';

export const load = async () => {
	return { users: await prisma.user.findMany() };
};
