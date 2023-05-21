<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';

  export let start: { lat: number; lng: number };
  export let end: { lat: number; lng: number };
  export let color: string;

  const map: L.Map = getContext('leafletMapInstance');

  const line = L.polyline(
    [
      [start.lat, start.lng],
      [end.lat, end.lng]
    ],
    { color }
  ).addTo(map);

  onDestroy(() => {
    line.remove();
  });
</script>
