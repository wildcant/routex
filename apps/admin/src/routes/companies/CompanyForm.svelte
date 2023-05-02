<script lang="ts">
	import type { Validation } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { companySchema, type CompanySchema } from './schema';
	import { globalErrorMessage } from '../../stores';

	export let data: Validation<CompanySchema>;

	export let submitLabel: string;
	const { form, errors, enhance, allErrors } = superForm(data, {
		validators: companySchema
	});

	$: unhandledErrors = $allErrors.filter((err) => err.path[0] === '_errors');
	$: showGlobalError = unhandledErrors?.length > 0;
	$: {
		if (showGlobalError) {
			globalErrorMessage.set(
				'There was a problem saving the company. Please review the errors below.'
			);
		}
	}
</script>

{#if showGlobalError}
	<div class="alert alert-danger">
		<p>
			{#each unhandledErrors as error}
				{error.message}
			{/each}
		</p>
	</div>
{/if}

<form method="post" use:enhance>
	<label for="name" aria-required="true">Name</label>
	<input
		type="text"
		id="name"
		name="name"
		aria-invalid={$errors?.name ? 'true' : null}
		bind:value={$form.name}
	/>
	{#if $errors.name}<small class="text-red">{$errors.name}</small>{/if}

	<button type="submit">{submitLabel}</button>
</form>
