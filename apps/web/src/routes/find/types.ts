import type { Prettify } from '../../types';
import type { PageData } from './$types';

export type ExtendedPole = Omit<
  PageData['storedTransmissionLines'][0]['poles'][0],
  'createdAt' | 'updatedAt'
>;

export type ExtendedLine = Omit<
  PageData['storedTransmissionLines'][0]['lines'][0],
  'createdAt' | 'updatedAt'
>;

export type ExtendedTransmissionLine = Prettify<
  Omit<
    PageData['storedTransmissionLines'][0],
    | 'createdAt'
    | 'updatedAt'
    | 'poles'
    | 'lines'
    | 'createdByUserId'
    | 'updatedByUserId'
    | 'companyId'
  > & {
    poles: ExtendedPole[];
    lines: ExtendedLine[];
  }
>;
