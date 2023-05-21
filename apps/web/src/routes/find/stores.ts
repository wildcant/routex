import { writable } from 'svelte/store';
import type { TransmissionLine } from './types';

type IsDrawing =
  | { value: false }
  | { value: true; mode: 'edit'; transmissionLineId: string }
  | { value: true; mode: 'new' };

export const isDrawing = writable<IsDrawing>({
  value: false
});
export const initialState = writable<{ transmissionLines: TransmissionLine[] }>({
  transmissionLines: []
});
export const transmissionLines = writable<TransmissionLine[]>([]);
