import { error, type RequestHandler } from '@sveltejs/kit';
import { prisma } from 'database/server';

export const PATCH: RequestHandler = async ({ params, request }) => {
  if (!params.id) throw error(400, { message: 'Missing transmission line id param.' });
  await prisma.transmissionLine.update({ where: { id: params.id }, data: await request.json() });
  return new Response(JSON.stringify({ success: true }));
};
