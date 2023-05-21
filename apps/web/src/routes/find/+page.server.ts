import { prisma } from 'database/server';

export const load = async () => {
  return {
    storedTransmissionLines: await prisma.transmissionLine.findMany({
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
