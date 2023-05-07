import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return new Response(JSON.stringify({ users: await prisma.user.findMany() }));
};
