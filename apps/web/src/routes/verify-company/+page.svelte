<script lang="ts">
  import cn from 'classnames';
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import { companyHashSchema } from './schema';

  export let data: PageData;

  const { form, errors, enhance, submitting, allErrors } = superForm(data.form, {
    validators: companyHashSchema
  });
  $: unhandledErrors = $allErrors.filter((err) => err.path[0] === '_errors');
  $: showGlobalError = unhandledErrors?.length > 0;
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
      Check your company
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
          >Company Identifier</label
        >
        <div class="mt-2">
          <input
            id="hash"
            name="hash"
            type="text"
            class={cn('input', { 'input-error': $errors?.hash })}
            bind:value={$form.hash}
          />
          {#if $errors.hash}<small class="text-red-400">{$errors.hash}</small>{/if}
        </div>
      </div>

      <div>
        <button type="submit" class="btn variant-filled" disabled={$submitting}
          >Verify Company</button
        >
      </div>
    </form>
  </div>
</div>
