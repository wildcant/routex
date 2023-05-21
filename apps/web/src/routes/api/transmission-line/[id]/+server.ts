import { error, type RequestHandler } from '@sveltejs/kit';
import { prisma } from 'database/server';
import type { PageData } from '../../../find/$types';

export const PATCH: RequestHandler = async ({ params, request }) => {
  const transmissionLineId = params.id;
  if (!transmissionLineId) throw error(400, { message: 'Missing transmission line id param.' });
  const data = (await request.json()) as PageData['storedTransmissionLines'][0];

  await Promise.all([
    ...data.poles.map((pole) =>
      prisma.pole.upsert({
        where: { id: pole.id },
        create: { id: pole.id, lat: pole.lat, lng: pole.lng, transmissionLineId },
        update: { lat: pole.lat, lng: pole.lng, transmissionLineId }
      })
    )
  ]);

  await Promise.all([
    ...data.lines.map((line) => {
      return prisma.line.upsert({
        where: { id: line.id },
        create: {
          TransmissionLine: { connect: { id: transmissionLineId } },
          start: { connect: { id: line.start.id } },
          end: { connect: { id: line.end.id } }
        },
        update: {}
      });
    })
  ]);

  return new Response(JSON.stringify({ success: true }));
};
