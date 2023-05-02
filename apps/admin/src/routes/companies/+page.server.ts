import { prisma } from 'database';

export const load = async () => {
	return { companies: await prisma.company.findMany() };
};
