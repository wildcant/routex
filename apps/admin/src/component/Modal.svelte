<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import { modal, closeModal } from '../stores';
</script>

<!-- TODO: Research: Can you make a modal that works without js? -->
<dialog open={$modal.isOpen}>
	<article>
		<header>
			<button
				aria-label="Close"
				class="close icon-button"
				on:click={closeModal}
				disabled={$modal.loading}
			/>
			{$modal.title}
		</header>
		<p>
			{#if typeof $modal.children === typeof SvelteComponent}
				<svelte:component this={$modal.children} on:click />
			{/if}

			{#if $modal.content}
				{$modal.content}
			{/if}
		</p>
		<div class="actions row col-xs-offset-3 col-xs-9">
			{#if $modal.primaryButtonProps}
				<button
					class="col-xs-offset-1 col-xs-5"
					on:click={$modal.primaryButtonProps?.onClick}
					aria-busy={$modal.loading}
					disabled={$modal.loading}
				>
					{$modal.primaryButtonProps?.text}
				</button>
			{/if}

			{#if $modal.secondaryButtonProps}
				<button class="col-xs-offset-1 col-xs-5 secondary outline" on:click={closeModal}>
					{$modal.secondaryButtonProps?.text}
				</button>
			{/if}
		</div>
	</article>
</dialog>

<style>
	article {
		min-width: 100%;
		padding-bottom: 6px;
	}

	header {
		margin-bottom: 6px;
	}

	div.actions {
		margin-top: 3rem;
	}

	@media (min-width: 640px) {
		article {
			min-width: 300px;
		}
	}

	@media (min-width: 768px) {
		article {
			min-width: 500px;
		}
	}

	@media (min-width: 1024px) {
		article {
			min-width: 700px;
		}
	}

	@media (min-width: 1280px) {
		article {
			min-width: 700px;
		}
	}
</style>
