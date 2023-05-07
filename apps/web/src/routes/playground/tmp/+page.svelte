<script lang="ts">
  import { browser } from '$app/environment';
  import type { LatLngTuple } from 'leaflet';
  import type { Map, Control } from 'leaflet';

  import { onDestroy, onMount } from 'svelte';

  let mapElement: HTMLDivElement;
  let map: Map;

  onMount(async () => {
    if (browser) {
      const L = await import('leaflet');
      await import('leaflet-draw');

      var center: LatLngTuple = [46.165164, 15.750443];

      // Create the map
      var map = L.map('map').setView(center, 16);

      // Set up the OSM layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
      }).addTo(map);

      // Initialise the FeatureGroup to store editable layers
      let editableLayers = new L.FeatureGroup();
      map.addLayer(editableLayers);

      const poleIcon = L.icon({
        iconUrl:
          'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI5LjMzNCAyOS4zMzQiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTE0LjY2NiwwQzYuNTc4LDAsMCw2LjU4LDAsMTQuNjY3czYuNTc4LDE0LjY2NywxNC42NjYsMTQuNjY3czE0LjY2OC02LjU4LDE0LjY2OC0xNC42NjdTMjIuNzU0LDAsMTQuNjY2LDB6DQoJCSBNMTQuNjY2LDI1LjMzNEM4Ljc4NCwyNS4zMzQsNCwyMC41NDksNCwxNC42NjdTOC43ODQsNCwxNC42NjYsNGM1Ljg4MywwLDEwLjY2OCw0Ljc4NSwxMC42NjgsMTAuNjY3UzIwLjU0NywyNS4zMzQsMTQuNjY2LDI1LjMzNA0KCQl6IE0xOS4zMzIsMTQuNjY3YzAsMi41NzctMi4wODksNC42NjctNC42NjYsNC42NjdjLTIuNTc2LDAtNC42NjYtMi4wODktNC42NjYtNC42NjdDMTAsMTIuMDksMTIuMDksMTAsMTQuNjY2LDEwDQoJCUMxNy4yNDMsMTAsMTkuMzMyLDEyLjA5LDE5LjMzMiwxNC42Njd6Ii8+DQo8L2c+DQo8L3N2Zz4=',
        iconSize: [16, 16]
      });

      var options: Control.DrawConstructorOptions = {
        position: 'topleft',
        draw: {
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
              color: '#e1e100', // Color the shape will turn when intersects
              message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
            },
            shapeOptions: {
              color: '#97009c'
            }
          },
          polyline: {
            shapeOptions: {
              color: '#000',
              weight: 10,
              noClip: true
            },
            icon: poleIcon,
            touchIcon: poleIcon
          }
          // disable toolbar item by setting it to false
          // polyline: ,
          // circle: true, // Turns off this drawing tool
          // polygon: true,
          // marker: {
          //   icon: poleIcon
          // }
          // rectangle: true
        },
        edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: true
        }
      };

      // Initialise the draw control and pass it the FeatureGroup of editable layers
      var drawControl = new L.Control.Draw(options);
      map.addControl(drawControl);

      editableLayers = new L.FeatureGroup().addTo(map);

      map.on('draw:created', function (e) {
        // console.log('draw:created');
        // console.log(e);

        const type = e.type;
        const layer = e.layer;

        console.log(type, layer._latlngs);
        if (type === 'polyline') {
          layer.bindPopup('A polyline!');
        } else if (type === 'polygon') {
          layer.bindPopup('A polygon!');
        } else if (type === 'marker') {
          layer.bindPopup('marker!');
        } else if (type === 'circle') {
          layer.bindPopup('A circle!');
        } else if (type === 'rectangle') {
          layer.bindPopup('A rectangle!');
        }

        editableLayers.addLayer(layer);
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

<div id="map" bind:this={mapElement} />

<style>
  @import 'leaflet/dist/leaflet.css';
  @import 'leaflet-draw/dist/leaflet.draw.css';
  div#map {
    height: 800px;
  }
</style>
