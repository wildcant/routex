import { writable } from 'svelte/store';

import type { PageData } from './$types';

type IsDrawing =
  | { value: false }
  | { value: true; mode: 'edit'; transmissionLineId: string }
  | { value: true; mode: 'new' };

export const isDrawing = writable<IsDrawing>({
  value: false
});
export const initialState = writable<{ transmissionLines: PageData['storedTransmissionLines'] }>({
  transmissionLines: []
});
export const transmissionLines = writable<PageData['storedTransmissionLines']>([]);
