import { prisma } from '$lib/prisma';

export const load = async () => {
	return { companies: await prisma.company.findMany() };
};
