<script lang="ts">
  import L from 'leaflet';
  import { getContext } from 'svelte';
  import 'polyline-encoded';
  import { directionsPolyLineEncoded } from './stores';

  let map: L.Map = getContext('leafletMapInstance');

  $: if ($directionsPolyLineEncoded) {
    let polyline = L.Polyline.fromEncoded($directionsPolyLineEncoded).addTo(map);
    map.fitBounds(polyline.getBounds());
  }
</script>
