import { prisma } from '$lib/server/prisma';

export const load = async () => {
	return { companies: await prisma.company.findMany() };
};
