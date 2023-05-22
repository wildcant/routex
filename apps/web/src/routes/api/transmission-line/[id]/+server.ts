import { error, type RequestHandler } from '@sveltejs/kit';
import { prisma } from 'database/server';
import type { PageData } from '../../../find/$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  const transmissionLineId = params.id;
  if (!transmissionLineId) throw error(400, { message: 'Missing transmission line id param.' });

  const transmissionLine = await prisma.transmissionLine.findUnique({
    where: { id: transmissionLineId },
    select: { id: true, companyId: true, poles: true, lines: true }
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

    const deletedLines = transmissionLine.lines
      .filter((line) => !data.lines.find((l) => line.id === l.id))
      .map((line) => line.id);

    await Promise.all([
      ...data.lines.map((line) =>
        tx.line.upsert({
          where: { id: line.id },
          create: {
            TransmissionLine: { connect: { id: transmissionLineId } },
            start: { connect: { id: line.start.id } },
            end: { connect: { id: line.end.id } }
          },
          update: {
            start: { connect: { id: line.start.id } },
            end: { connect: { id: line.end.id } }
          }
        })
      ),
      tx.line.deleteMany({ where: { id: { in: deletedLines } } })
    ]);

    const deletedPoles = transmissionLine.poles
      .filter((pole) => !data.poles.find((p) => pole.id === p.id))
      .map((pole) => pole.id);

    await tx.pole.deleteMany({ where: { id: { in: deletedPoles } } });
  });

  return new Response(JSON.stringify({ success: true }));
};
