import { prisma } from 'database/server';

export const load = async ({ locals }) => {
  return {
    user: locals.user,
    storedTransmissionLines: await prisma.transmissionLine.findMany({
      where: { companyId: locals.user?.companyId },
      include: {
        poles: true,
        lines: {
          include: {
            start: { select: { id: true, lat: true, lng: true } },
            end: { select: { id: true, lat: true, lng: true } }
          }
        }
      }
    })
  };
};
