import { prisma } from 'database/server';

export const load = async () => {
  return { storedTransmissionLines: await prisma.transmissionLine.findMany() };
};
