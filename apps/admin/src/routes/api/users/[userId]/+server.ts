import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ params }) => {
	if (!params.userId) throw error(400, { message: 'Missing company id param.' });

	await prisma.user.delete({ where: { id: params.userId } });

	return new Response(JSON.stringify({ success: true }));
};
