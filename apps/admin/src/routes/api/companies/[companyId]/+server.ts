import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { prisma } from 'database';

export const DELETE: RequestHandler = async ({ params }) => {
	if (!params.companyId) throw error(400, { message: 'Missing company id param.' });

	await prisma.company.delete({ where: { id: parseInt(params.companyId) } });

	return new Response(JSON.stringify({ success: true }));
};
