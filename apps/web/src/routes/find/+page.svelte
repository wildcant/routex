<script lang="ts">
  import { browser } from '$app/environment';
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { popup, storePopup, type PopupSettings } from '@skeletonlabs/skeleton';
  import type { Control, Map } from 'leaflet';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
  import { assets, config, sampleLines } from './map-config';
  import type Leaflet from 'leaflet';
  import cn from 'classnames';

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  let mapElement: HTMLDivElement;
  let map: Map;
  let userMenu: HTMLDivElement;
  let drawMenu: HTMLDivElement;
  let createPoleBtn: HTMLButtonElement;
  let poleMenu: HTMLDivElement;
  let branchBtn: HTMLButtonElement;
  let editDrawOptions: HTMLDivElement;
  let saveBtn: HTMLButtonElement;
  let cancelBtn: HTMLButtonElement;
  let L: typeof Leaflet;
  const isDrawing = writable(false);
  const isMapDragging = writable(false);
  const lines = writable<FeatureCollection<Geometry, GeoJsonProperties>[]>(sampleLines);

  onMount(async () => {
    if (browser) {
      L = await import('leaflet');
      const poleIcon = L.icon({
        iconUrl: assets.icons.pole.url,
        iconSize: assets.icons.pole.size
      });

      // Create Map
      map = L.map(mapElement, { zoomControl: false }).setView(config.center, config.zoom);
      map.on('dragstart', () => isMapDragging.set(true));
      map.on('dragend', () => isMapDragging.set(false));

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.tileLayer(config.tiles.carto.urlTemplate, config.tiles.carto.options).addTo(map);

      // User Menu
      L.Control.UserMenu = L.Control.extend<Pick<Control, 'onAdd'>>({ onAdd: () => userMenu });
      L.control.userMenu = (opts) => new L.Control.UserMenu(opts);
      L.control.userMenu({ position: 'topright' }).addTo(map);

      // UI Draw Control
      L.Control.CustomDraw = L.Control.extend<Pick<Control, 'onAdd'>>({
        onAdd: () => drawMenu
      });
      L.control.customDraw = (opts) => new L.Control.CustomDraw(opts);
      L.control.customDraw({ position: 'bottomright' }).addTo(map);

      // Edit Options
      L.Control.EditCustomDrawOptions = L.Control.extend<Pick<Control, 'onAdd'>>({
        onAdd: () => editDrawOptions
      });
      L.control.editCustomDrawOptions = (opts) => new L.Control.EditCustomDrawOptions(opts);
      L.control.editCustomDrawOptions({ position: 'bottomleft' }).addTo(map);

      const newPoles = L.layerGroup();
      newPoles.addTo(map);

      const addPole = (e: L.LeafletMouseEvent) => {
        var popup = L.popup({ closeButton: false })
          .setLatLng(e.latlng)
          .setContent(poleMenu)
          .openOn(map);

        const marker = L.marker(e.latlng, { icon: poleIcon });
        marker.bindPopup(popup).closePopup();
        marker.addEventListener('contextmenu', () => {
          marker.openPopup();
          branchBtn.addEventListener('click', () => marker.closePopup(), { once: true });
        });
        marker.addTo(newPoles);
      };

      createPoleBtn.addEventListener('click', () => {
        isDrawing.set(true);
        map.once('click', addPole);
        isDrawing.set(false);
      });

      branchBtn.addEventListener('click', () => {
        isDrawing.set(true);
        map.addEventListener('click', addPole);
      });

      saveBtn.addEventListener('click', () => {
        lines.update((l) =>
          l.concat(newPoles.toGeoJSON() as FeatureCollection<Geometry, GeoJsonProperties>)
        );
        newPoles.removeFrom(map);
      });

      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isDrawing.set(false);
        map.removeEventListener('click', addPole);
        newPoles.removeFrom(map);
      });
    }
  });

  onDestroy(async () => {
    if (map) {
      console.log('Unloading Leaflet map.');
      map.remove();
    }
  });

  // Draw a line example
  $: {
    if (L && map) {
      console.log($lines);

      $lines.map((line) => {
        console.log({ line });

        L.geoJSON(line.features, {
          style: (feature) => ({ color: feature?.properties.color as string }),
          markersInheritOptions: true
        }).addTo(map);
      });
    }
  }

  let popupProfileMenu: PopupSettings = {
    event: 'click',
    target: 'user-menu',
    placement: 'bottom',
    // Close the popup when the item is clicked
    closeQuery: '.menu-item'
  };

  $: cursor = 'grab';
  $: {
    if ($isDrawing) {
      cursor = 'crosshair';
    } else if ($isMapDragging) {
      cursor = 'grabbing';
    } else {
      cursor = 'grab';
    }
  }
  $: console.log('lines: ', $lines);
</script>

<div id="map" bind:this={mapElement} style:--cursor={cursor} />

<!-- User Menu -->
<div
  bind:this={userMenu}
  on:click|stopPropagation
  on:keydown|stopPropagation
  on:keypress|stopPropagation
  on:dblclick|stopPropagation
>
  <button class="btn-icon" use:popup={popupProfileMenu}>
    <figure class="avatar">
      <img
        class="avatar-image rounded-full w-16"
        width="200"
        src="https://i.pravatar.cc/?img=48"
        alt="avatar"
      />
    </figure>
  </button>

  <div class="card w-48 shadow-xl p-2 bg-white rounded-md" data-popup="user-menu">
    <div id="speed-dial-menu-top-right" class="flex flex-col items-center bg-white">
      <button
        class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-primary-500 hover:text-white menu-item"
      >
        Logout
      </button>
    </div>

    <div class="arrow bg-white" />
  </div>
</div>

<!-- Draw Menu -->
<div bind:this={drawMenu}>
  <div class="ctrl shadow-lg bg-white flex flex-col">
    <button
      class="draw-btn"
      aria-label="Draw Point (m)"
      bind:this={createPoleBtn}
      on:click|stopPropagation
    >
      <img
        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI5LjMzNCAyOS4zMzQiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTE0LjY2NiwwQzYuNTc4LDAsMCw2LjU4LDAsMTQuNjY3czYuNTc4LDE0LjY2NywxNC42NjYsMTQuNjY3czE0LjY2OC02LjU4LDE0LjY2OC0xNC42NjdTMjIuNzU0LDAsMTQuNjY2LDB6DQoJCSBNMTQuNjY2LDI1LjMzNEM4Ljc4NCwyNS4zMzQsNCwyMC41NDksNCwxNC42NjdTOC43ODQsNCwxNC42NjYsNGM1Ljg4MywwLDEwLjY2OCw0Ljc4NSwxMC42NjgsMTAuNjY3UzIwLjU0NywyNS4zMzQsMTQuNjY2LDI1LjMzNA0KCQl6IE0xOS4zMzIsMTQuNjY3YzAsMi41NzctMi4wODksNC42NjctNC42NjYsNC42NjdjLTIuNTc2LDAtNC42NjYtMi4wODktNC42NjYtNC42NjdDMTAsMTIuMDksMTIuMDksMTAsMTQuNjY2LDEwDQoJCUMxNy4yNDMsMTAsMTkuMzMyLDEyLjA5LDE5LjMzMiwxNC42Njd6Ii8+DQo8L2c+DQo8L3N2Zz4="
        alt="pole"
      />
    </button>
    <!-- <button class="draw-btn" aria-label="Draw LineString (l)" />
    <button class="draw-btn" aria-label="Draw Polygon (p)" />
    <button class="draw-btn" aria-label="Draw Rectangular Polygon (r)" />
    <button class="draw-btn" aria-label="Draw Circular Polygon (c)" /> -->
  </div>
</div>

<!-- Edit Mode Options -->
<div bind:this={editDrawOptions}>
  <div class={cn({ hidden: !$isDrawing })}>
    <button bind:this={saveBtn} class="btn variant-filled-secondary rounded-md">Save</button>
    <button bind:this={cancelBtn} class="btn variant-ringed-secondary rounded-md bg-white">
      Cancel
    </button>
  </div>
</div>

<div bind:this={poleMenu}>
  <div class="flex flex-col items-center mb-4 space-y-2">
    <button
      type="button"
      data-tooltip-target="tooltip-share"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
    >
      <svg
        aria-hidden="true"
        class="w-6 h-6 -ml-px"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
        />
      </svg>
      <span class="sr-only">Share</span>
    </button>
    <div
      id="tooltip-share"
      role="tooltip"
      class="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    >
      Share
      <div class="tooltip-arrow" data-popper-arrow />
    </div>
    <button
      type="button"
      data-tooltip-target="tooltip-print"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
    >
      <svg
        aria-hidden="true"
        class="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
          clip-rule="evenodd"
        />
      </svg>
      <span class="sr-only">Print</span>
    </button>
    <div
      id="tooltip-print"
      role="tooltip"
      class="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    >
      Print
      <div class="tooltip-arrow" data-popper-arrow />
    </div>
    <button
      type="button"
      data-tooltip-target="tooltip-download"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
    >
      <svg
        aria-hidden="true"
        class="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 00-2 0v1.586l-.293-.293a.999.999 0 10-1.414 1.414l2 2a.999.999 0 001.414 0l2-2a.999.999 0 10-1.414-1.414l-.293.293V9z"
          fill-rule="evenodd"
        />
      </svg>
      <span class="sr-only">Download</span>
    </button>
    <div
      id="tooltip-download"
      role="tooltip"
      class="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    >
      Download
      <div class="tooltip-arrow" data-popper-arrow />
    </div>
    <button
      type="button"
      data-tooltip-target="tooltip-copy"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
    >
      <svg
        aria-hidden="true"
        class="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path
          d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"
        />
      </svg>
      <span class="sr-only">Copy</span>
    </button>
    <button
      bind:this={branchBtn}
      type="button"
      data-tooltip-target="tooltip-copy"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20">
        <path
          d="M7.10508 8.78991C7.45179 10.0635 8.61653 11 10 11H14C16.4703 11 18.5222 12.7915 18.9274 15.1461C20.1303 15.5367 21 16.6668 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.7334 15.7849 15.6501 16.8949 15.2101C16.5482 13.9365 15.3835 13 14 13H10C8.87439 13 7.83566 12.6281 7 12.0004V15.1707C8.16519 15.5825 9 16.6938 9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.6938 3.83481 15.5825 5 15.1707V8.82929C3.83481 8.41746 3 7.30622 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6C9 7.26661 8.21506 8.34988 7.10508 8.78991ZM6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7ZM6 19C6.55228 19 7 18.5523 7 18C7 17.4477 6.55228 17 6 17C5.44772 17 5 17.4477 5 18C5 18.5523 5.44772 19 6 19ZM18 19C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17C17.4477 17 17 17.4477 17 18C17 18.5523 17.4477 19 18 19Z"
        />
      </svg>
    </button>

    <div
      id="tooltip-copy"
      role="tooltip"
      class="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    >
      Copy
    </div>
  </div>
</div>

<style>
  @import 'leaflet/dist/leaflet.css';
  :global(a) {
    text-decoration: none !important;
  }

  div.ctrl button {
    @apply border-b-stone-50 border-solid border;
  }

  .draw-btn {
    @apply w-7 h-7 shadow-none border-0 p-1;
  }
  div#map {
    height: 100vh;
    cursor: var(--cursor);
  }

  :global(.leaflet-popup-content-wrapper) {
    @apply bg-transparent shadow-none;
  }
  :global(.leaflet-popup-tip) {
    @apply hidden;
  }
</style>
