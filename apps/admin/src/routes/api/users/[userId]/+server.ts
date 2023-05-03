import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export const DELETE: RequestHandler = async ({ params }) => {
	if (!params.userId) throw error(400, { message: 'Missing company id param.' });

	await prisma.user.delete({ where: { id: parseInt(params.userId) } });

	return new Response(JSON.stringify({ success: true }));
};
