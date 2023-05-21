import type { PageData } from './$types';

export type ExtendedPole = PageData['storedTransmissionLines'][0]['poles'][0];
export type ExtendedLine = PageData['storedTransmissionLines'][0]['lines'][0];
