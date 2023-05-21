import type { RequestHandler } from '@sveltejs/kit';
import { prisma, type Prisma } from 'database/server';

export const POST: RequestHandler = async ({ request }) => {
  const newTransmissionLine = (await request.json()) as Prisma.TransmissionLineCreateInput;

  await prisma.transmissionLine.create({
    data: {
      geojson: newTransmissionLine.geojson,
      color: newTransmissionLine.color
    }
  });

  return new Response(JSON.stringify({ success: true }));
};
