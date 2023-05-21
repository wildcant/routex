import { error, type RequestHandler } from '@sveltejs/kit';
import { prisma, type Prisma } from 'database/server';
import type { PageData } from '../../find/$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = (await request.json()) as PageData['storedTransmissionLines'][0];
  if (!locals.user)
    throw error(401, { message: `You must login in order to create a new transmission line.` });

  const transmissionLine = await prisma.transmissionLine.create({
    data: {
      id: data.id,
      color: data.color,
      companyId: locals.user.companyId,
      createdByUserId: locals.user.id,
      updatedByUserId: locals.user.id
    }
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
