import { writable } from 'svelte/store';

export const globalErrorMessage = writable<string | undefined>();
