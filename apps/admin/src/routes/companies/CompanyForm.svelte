<script lang="ts">
	import type { Company } from 'database';
	import type { typeToFlattenedError } from 'zod';
	import type { CompanyFormData } from './utils';
	import { enhance } from '$app/forms';

	export let submitLabel = 'Submit';
	export let formState: {
		defaultValues?: Partial<Company> | null;
		errors?: typeToFlattenedError<CompanyFormData>['fieldErrors'];
	};
	const { errors, defaultValues } = formState ?? {};
</script>

<form method="post" use:enhance>
	<label for="name" aria-required="true">Name</label>
	<input
		type="text"
		id="name"
		name="name"
		aria-invalid={errors?.name ? 'true' : null}
		value={defaultValues?.name ? defaultValues?.name : ''}
	/>
	{#if errors?.name}
		<small class="text-red">{errors.name[0]}</small>
	{/if}
	<button type="submit">{submitLabel}</button>
</form>
