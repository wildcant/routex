import { error, type RequestHandler } from '@sveltejs/kit';
import { prisma } from 'database/server';
import type { PageData } from '../../../find/$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  const transmissionLineId = params.id;
  if (!transmissionLineId) throw error(400, { message: 'Missing transmission line id param.' });

  const transmissionLine = await prisma.transmissionLine.findUnique({
    where: { id: transmissionLineId },
    select: { id: true, companyId: true }
  });

  if (!transmissionLine)
    throw error(404, { message: `Transmission line id ${transmissionLineId} was not found.` });
  if (!locals.user || transmissionLine.companyId !== locals.user?.companyId)
    throw error(401, { message: `You're not allowed to update this transmission line.` });

  const data = (await request.json()) as PageData['storedTransmissionLines'][0];

  await prisma.$transaction(async (tx) => {
    tx.transmissionLine.update({
      where: { id: transmissionLineId },
      data: { updatedByUserId: locals.user?.id }
    });

    await Promise.all([
      ...data.poles.map((pole) =>
        tx.pole.upsert({
          where: { id: pole.id },
          create: { id: pole.id, lat: pole.lat, lng: pole.lng, transmissionLineId },
          update: { lat: pole.lat, lng: pole.lng, transmissionLineId }
        })
      )
    ]);

    await Promise.all([
      ...data.lines.map((line) =>
        tx.line.upsert({
          where: { id: line.id },
          create: {
            TransmissionLine: { connect: { id: transmissionLineId } },
            start: { connect: { id: line.start.id } },
            end: { connect: { id: line.end.id } }
          },
          update: {}
        })
      )
    ]);
  });

  return new Response(JSON.stringify({ success: true }));
};
