import { writable } from 'svelte/store';
import type { ExtendedTransmissionLine } from './types';

type IsDrawing =
  | { value: false }
  | { value: true; mode: 'edit'; transmissionLineId: string }
  | { value: true; mode: 'new' };

export const isDrawing = writable<IsDrawing>({
  value: false
});
export const initialState = writable<{ transmissionLines: ExtendedTransmissionLine[] }>({
  transmissionLines: []
});
export const transmissionLines = writable<ExtendedTransmissionLine[]>([]);
export const selectedPoleId = writable<string>();
export const directionsPolyLineEncoded = writable<string>();
