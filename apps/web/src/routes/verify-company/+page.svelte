<script lang="ts">
  import cn from 'classnames';
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import { companyHashSchema } from './schema';

  export let data: PageData;
  let error = data.error;
  const closeAlert = () => (error = null);
  const { form, errors, enhance, submitting, allErrors } = superForm(data.form, {
    validators: companyHashSchema
  });
  $: unhandledErrors = $allErrors.filter((err) => err.path[0] === '_errors');
  $: showGlobalError = unhandledErrors?.length > 0;
</script>

{#if error}
  <div class="absolute w-full">
    <div class="alert variant-filled-error">
      <div>
        <span class="badge-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
            />
          </svg>
        </span>
      </div>

      <div class="alert-message">
        <p>{error}</p>
      </div>

      <div class="alert-actions">
        <button class="btn-icon" on:click={closeAlert}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}

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
    <form class="space-y-6" method="POST" autocomplete="off" use:enhance>
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
