<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import type { PageData } from './$types';
  import { initialState, transmissionLines } from './stores';

  export let data: PageData;

  setContext('user', data.user);

  initialState.set({ transmissionLines: data.storedTransmissionLines });
  transmissionLines.set(data.storedTransmissionLines);

  let MapContainer: ConstructorOfATypedSvelteComponent;
  onMount(async () => {
    MapContainer = (await import('./MapContainer.svelte')).default;
  });
</script>

<svelte:component this={MapContainer} />
