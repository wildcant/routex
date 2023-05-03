<script lang="ts">
  import cn from 'classnames';
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import { loginSchema } from './schema';

  export let data: PageData;

  const { form, errors, enhance, submitting, allErrors } = superForm(data.form, {
    validators: loginSchema
  });
  $: unhandledErrors = $allErrors.filter((err) => err.path[0] === '_errors');
  $: showGlobalError = unhandledErrors?.length > 0;
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
      Sign in
    </h2>

    {#if showGlobalError}
      <br />
      <div class="bg-red-50 p-4">
        {#each unhandledErrors as error}
          <small class="text-red-500">{error.message}</small>
        {/each}
      </div>
    {/if}
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" method="POST" use:enhance>
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
          >Email address</label
        >
        <div class="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            class={cn('input', { 'input-error': $errors?.email })}
            bind:value={$form.email}
          />
          {#if $errors.email}<small class="text-red-400">{$errors.email}</small>{/if}
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
          Password
        </label>
        <div class="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            class={cn('input', { 'input-error': $errors?.password })}
            bind:value={$form.password}
          />
        </div>
        {#if $errors.password}<small class="text-red-400">{$errors.password}</small>{/if}
      </div>

      <div>
        <button type="submit" class="btn variant-filled" disabled={$submitting}>Login</button>
      </div>
    </form>
  </div>
</div>
