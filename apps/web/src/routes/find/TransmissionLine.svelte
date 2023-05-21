<script lang="ts">
  import type { Feature, FeatureCollection, LineString, Point } from 'geojson';
  import Line from './Line.svelte';
  import Pole from './Pole.svelte';

  export let id: string;
  export let geojson: FeatureCollection;
  export let color: string;

  $: poles = geojson.features.filter(
    (feature) => feature.geometry.type === 'Point'
  ) as Feature<Point>[];

  $: lines = geojson.features.filter(
    (feature) => feature.geometry.type === 'LineString'
  ) as Feature<LineString>[];
</script>

{#each poles as pole (pole.id)}
  <Pole
    transmissionLineId={id}
    lng={pole.geometry.coordinates[0]}
    lat={pole.geometry.coordinates[1]}
    {color}
  />
{/each}

{#each lines as line (line.id)}
  <Line positions={line.geometry.coordinates} {color} />
{/each}
