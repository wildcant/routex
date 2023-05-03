<script lang="ts">
	import type { Validation } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { userSchema, type UserSchema } from './schema';
	import { globalErrorMessage } from '../../stores';
	import { Role } from 'database/client';

	export let data: Validation<UserSchema>;

	export let submitLabel: string;
	const { form, errors, enhance, allErrors, submitting } = superForm(data, {
		validators: userSchema
	});

	$: unhandledErrors = $allErrors.filter((err) => err.path[0] === '_errors');
	$: showGlobalError = unhandledErrors?.length > 0;
	$: {
		if (showGlobalError) {
			globalErrorMessage.set(
				'There was a problem saving the user. Please review the errors below.'
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

	<label for="email" aria-required="true">Email</label>
	<input
		type="email"
		id="email"
		name="email"
		aria-invalid={$errors?.email ? 'true' : null}
		bind:value={$form.email}
	/>
	{#if $errors.email}<small class="text-red">{$errors.email}</small>{/if}

	<fieldset>
		<legend>Role</legend>
		<label for={Role.USER}>
			<input type="radio" id={Role.USER} name="role" bind:group={$form.role} value={Role.USER} />
			User
		</label>
		<label for={Role.ADMIN}>
			<input type="radio" id={Role.ADMIN} name="role" bind:group={$form.role} value={Role.ADMIN} />
			Admin
		</label>
	</fieldset>
	<button type="submit" aria-busy={$submitting} disabled={$submitting}>{submitLabel}</button>
</form>
