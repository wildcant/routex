import type { RequestHandler } from '@sveltejs/kit';
import { prisma, type Prisma } from 'database/server';
import type { PageData } from '../../find/$types';

export const POST: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as PageData['storedTransmissionLines'][0];

  const transmissionLine = await prisma.transmissionLine.create({
    data: { id: data.id, color: data.color }
  });
  const transmissionLineId = transmissionLine.id;
  const poles: Prisma.PoleCreateManyInput[] = data.poles.map((pole) => ({
    ...pole,
    transmissionLineId
  }));
  const lines: Prisma.LineCreateManyInput[] = data.lines.map((line) => ({
    transmissionLineId,
    startPoleId: line.startPoleId,
    endPoleId: line.endPoleId
  }));

  await prisma.pole.createMany({ data: poles });
  await prisma.line.createMany({ data: lines });

  return new Response(JSON.stringify({ success: true }));
};
