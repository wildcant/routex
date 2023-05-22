<script lang="ts">
  import { popup } from '@skeletonlabs/skeleton';
  import cn from 'classnames';
  import L from 'leaflet';
  import { getContext, onMount } from 'svelte';
  import { selectedPoleId, transmissionLines } from './stores';

  type Option = { id: string; label: string };

  let searchContainer: HTMLDivElement;
  let map: L.Map = getContext('leafletMapInstance');
  let query = '';
  let selected: Option | undefined;

  onMount(() => {
    L.Control.Search = L.Control.extend<Pick<L.Control, 'onAdd'>>({ onAdd: () => searchContainer });
    L.control.search = (opts) => new L.Control.Search(opts);
    L.control.search({ position: 'topleft' }).addTo(map);
  });

  const poles: Option[] = $transmissionLines
    .map((tl) => tl.poles)
    .flat()
    .map((p) => ({ id: p.id, label: p.id }));

  $: filteredPeople =
    query === ''
      ? poles
      : poles.filter((person) =>
          person.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );
  $: if (query === '' && selected) selected = undefined;
  $: if (selected?.id) selectedPoleId.set(selected.id);
</script>

<div bind:this={searchContainer}>
  <input
    class="input autocomplete"
    type="search"
    name="autocomplete-search"
    bind:value={query}
    placeholder="Search..."
    use:popup={{
      event: 'focus',
      target: 'pole-autocomplete',
      placement: 'bottom'
    }}
  />
  <div data-popup="pole-autocomplete">
    <ul
      class="w-[248.5px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
    >
      {#if filteredPeople.length === 0 && query !== ''}
        <li class="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</li>
      {:else}
        {#each filteredPeople as person}
          <li
            class={cn('relative cursor-default select-none py-2 pl-4 pr-4 text-gray-900', {
              'bg-teal-600 text-white': selected?.id === person.id
            })}
            on:click={() => {
              query = person.label;
              selected = person;
            }}
            on:keydown
            on:keyup
          >
            {person.label}
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
