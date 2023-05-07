import { prisma } from 'database/server';

export async function fetchCompaniesNames() {
	return prisma.company.findMany({ select: { id: true, name: true } });
}
