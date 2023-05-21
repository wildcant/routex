<script lang="ts">
  import type { Position } from 'geojson';
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';

  export let positions: Position[];
  export let color: string;

  const map: L.Map = getContext('leafletMapInstance');
  const latlngs = positions.map((p) => [p[1], p[0]]) as L.LatLngExpression[];

  const line = L.polyline(latlngs, { color }).addTo(map);

  onDestroy(() => {
    line.remove();
  });
</script>
