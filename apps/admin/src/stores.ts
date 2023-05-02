import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';
import merge from 'lodash/merge';
export const globalErrorMessage = writable<string | undefined>();

type ModalProps = {
	isOpen: boolean;
	loading?: boolean;
	title?: string;
	closeButton?: boolean;
	primaryButtonProps?: { text?: string; onClick: () => void };
	secondaryButtonProps?: { text?: string };
	children?: typeof SvelteComponent;
	content?: string;
};
const defaultModal: ModalProps = {
	isOpen: false,
	title: 'Confirm your action',
	content: 'Are you sure you want to proceed?',
	primaryButtonProps: { text: 'Confirm', onClick: () => {} },
	secondaryButtonProps: { text: 'Cancel' }
};
export const modal = writable<ModalProps>(defaultModal);
export const closeModal = () => modal.set(defaultModal);
export const setModalIsLoading = {
	on: () => modal.update((m) => ({ ...m, loading: true })),
	off: () => modal.update((m) => ({ ...m, loading: false }))
};
export const openModal = (modalProps?: Omit<ModalProps, 'isOpen'>) =>
	modal.set({ ...merge(defaultModal, modalProps), isOpen: true });
