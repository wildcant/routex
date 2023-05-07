<script lang="ts">
  import { browser } from '$app/environment';
  import type { Map } from 'leaflet';

  import { onDestroy, onMount } from 'svelte';

  let map: Map;

  onMount(async () => {
    if (browser) {
      const L = await import('leaflet');
      await import('leaflet-draw');

      map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // FeatureGroup is to store editable layers
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      L.control
        .layers({}, { Edit: drawnItems }, { position: 'topleft', collapsed: true })
        .addTo(map);

      const poleIcon = L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI5LjMzNCAyOS4zMzQiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTE0LjY2NiwwQzYuNTc4LDAsMCw2LjU4LDAsMTQuNjY3czYuNTc4LDE0LjY2NywxNC42NjYsMTQuNjY3czE0LjY2OC02LjU4LDE0LjY2OC0xNC42NjdTMjIuNzU0LDAsMTQuNjY2LDB6DQoJCSBNMTQuNjY2LDI1LjMzNEM4Ljc4NCwyNS4zMzQsNCwyMC41NDksNCwxNC42NjdTOC43ODQsNCwxNC42NjYsNGM1Ljg4MywwLDEwLjY2OCw0Ljc4NSwxMC42NjgsMTAuNjY3UzIwLjU0NywyNS4zMzQsMTQuNjY2LDI1LjMzNA0KCQl6IE0xOS4zMzIsMTQuNjY3YzAsMi41NzctMi4wODksNC42NjctNC42NjYsNC42NjdjLTIuNTc2LDAtNC42NjYtMi4wODktNC42NjYtNC42NjdDMTAsMTIuMDksMTIuMDksMTAsMTQuNjY2LDEwDQoJCUMxNy4yNDMsMTAsMTkuMzMyLDEyLjA5LDE5LjMzMiwxNC42Njd6Ii8+DQo8L2c+DQo8L3N2Zz4=',
        iconSize: [16, 16]
      });

      const drawControl = new L.Control.Draw({
        draw: {
          circle: false,
          marker: false,
          circlemarker: false,
          polygon: false,
          rectangle: false,
          polyline: {
            allowIntersection: false,
            drawError: { message: 'wth' },
            factor: 100,
            feet: true,
            guidelineDistance: 100,
            icon: poleIcon,
            maxGuideLineLength: 100,
            maxPoints: 100,
            metric: true,
            nautic: false,
            repeatMode: true,
            shapeOptions: {},
            showLength: true,
            touchIcon: poleIcon
          }
        },
        edit: {
          featureGroup: drawnItems
        }
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;

        console.log({ event });
        // console.log(event.layerType);

        drawnItems.addLayer(layer);
      });
    }
  });

  onDestroy(async () => {
    if (map) {
      console.log('Unloading Leaflet map.');
      map.remove();
    }
  });
</script>

<div id="map" />

<style>
  @import 'leaflet/dist/leaflet.css';
  @import 'leaflet-draw/dist/leaflet.draw.css';
  div#map {
    height: 800px;
  }
</style>
