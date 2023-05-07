<script lang="ts">
	import { Role, Status, type Company } from 'database/client';
	import type { Validation } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { globalErrorMessage } from '../../stores';
	import { userSchema, type UserSchema } from './schema';

	export let data: Validation<UserSchema>;
	export let submitLabel: string;

	type CompanyOption = Pick<Company, 'id' | 'name'>;
	export let companies: CompanyOption[];

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
	<fieldset>
		<legend>Status</legend>
		<label for={Status.ACTIVE}>
			<input
				type="radio"
				id={Status.ACTIVE}
				name="status"
				bind:group={$form.status}
				value={Status.ACTIVE}
			/>
			Active
		</label>
		<label for={Status.PENDING}>
			<input
				type="radio"
				id={Status.PENDING}
				name="status"
				bind:group={$form.status}
				value={Status.PENDING}
			/>
			Pending
		</label>
	</fieldset>

	<label for="company" aria-required="true">Company</label>
	<select
		id="company"
		name="companyId"
		bind:value={$form.companyId}
		aria-invalid={$errors.companyId ? 'true' : null}
		disabled={companies.length === 0}
	>
		{#each companies as company}
			<option value={company.id}>
				{company.name}
			</option>
		{/each}
	</select>
	{#if $errors.companyId}
		{#if companies.length === 0}
			<small class="text-red">
				Looks like there are no companies.
				<br />
				You need to add a company before creating a new user.
			</small>
		{:else}
			<small class="text-red">{$errors.companyId}</small>
		{/if}
	{/if}

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

	<label for="password" aria-required="true">Password</label>
	<input
		type="password"
		id="password"
		name="password"
		aria-invalid={$errors?.password ? 'true' : null}
		bind:value={$form.password}
	/>
	{#if $errors.password}<small class="text-red">{$errors.password}</small>{/if}

	<button type="submit" aria-busy={$submitting} disabled={$submitting}>{submitLabel}</button>
</form>
