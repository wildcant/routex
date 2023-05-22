<script lang="ts">
  import Line from './Line.svelte';
  import Pole from './Pole.svelte';
  import type { ExtendedLine, ExtendedPole } from './types';

  export let color: string;
  export let poles: ExtendedPole[];
  export let lines: ExtendedLine[];
</script>

{#each poles as { id, lat, lng, transmissionLineId } (id)}
  <Pole {id} {lat} {lng} {transmissionLineId} {color} />
{/each}

{#each lines as { id, start, end, transmissionLineId } (id)}
  <Line {id} {start} {end} {transmissionLineId} {color} />
{/each}
