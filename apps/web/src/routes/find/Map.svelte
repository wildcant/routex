<script lang="ts">
  import cn from 'classnames';
  import L from 'leaflet';
  import { onDestroy, onMount, setContext } from 'svelte';
  import { config, getRandomColor } from './map-config';
  import { addPole } from './map-utils';
  import { initialState, isDrawing, transmissionLines } from './stores';
  import { nanoid } from 'nanoid';

  let newTransmissionLineId = nanoid(11);
  let mapContainer: HTMLDivElement;
  let map: L.Map;
  let drawActions: HTMLDivElement;
  let drawMenu: HTMLDivElement;
  let isDragging = false;

  map = L.map(L.DomUtil.create('div'), { zoomControl: false }).setView(config.center, config.zoom);
  map.on('dragstart', () => (isDragging = true));
  map.on('dragend', () => (isDragging = false));

  setContext('leafletMapInstance', map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer(config.tiles.carto.urlTemplate, config.tiles.carto.options).addTo(map);

  onMount(() => {
    mapContainer.appendChild(map.getContainer());
    map.getContainer().style.width = '100%';
    map.getContainer().style.height = '100%';
    map.invalidateSize();

    // Edit Options
    L.Control.EditDrawActions = L.Control.extend<Pick<L.Control, 'onAdd'>>({
      onAdd: () => drawActions
    });
    L.control.editDrawActions = (opts) => new L.Control.EditDrawActions(opts);
    L.control.editDrawActions({ position: 'bottomleft' }).addTo(map);

    // Add new transmission line control
    L.Control.Draw = L.Control.extend<Pick<L.Control, 'onAdd'>>({
      onAdd: () => drawMenu
    });
    L.control.draw = (opts) => new L.Control.Draw(opts);
    L.control.draw({ position: 'bottomright' }).addTo(map);
  });

  onDestroy(() => {
    map.remove();
  });

  function handleUndoChanges() {
    map.removeEventListener('click');
    isDrawing.set({ value: false });
    transmissionLines.update(() => $initialState.transmissionLines);
  }

  function handleSaveChanges() {
    if ($isDrawing.value !== true)
      throw new Error(
        'TODO: Handle unexpected error. Trying to save changes but is not in drawing state.'
      );

    if ($isDrawing.mode === 'edit') {
      const transmissionLineId = $isDrawing.transmissionLineId;
      const transmissionLine = $transmissionLines.find(({ id }) => id === transmissionLineId);
      if (!transmissionLine)
        throw new Error('TODO: Handle unexpected error. Transmission line not found.');
      fetch(`/api/transmission-line/${transmissionLineId}`, {
        method: 'PATCH',
        body: JSON.stringify(transmissionLine)
      });
    } else if ($isDrawing.mode === 'new') {
      const transmissionLine = $transmissionLines.find(({ id }) => id === newTransmissionLineId);
      if (!transmissionLine)
        throw new Error('TODO: Handle unexpected error. New transmission line not found.');
      fetch(`/api/transmission-line`, {
        method: 'POST',
        body: JSON.stringify(transmissionLine)
      });
    }

    map.removeEventListener('click');
    isDrawing.set({ value: false });
  }

  function createTransmissionLine() {
    isDrawing.set({ value: true, mode: 'new' });
    map.once('click', (e) => {
      newTransmissionLineId = nanoid(11);
      const firstPole = {
        id: nanoid(11),
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        transmissionLineId: newTransmissionLineId
      };
      transmissionLines.update((currentTransmissionLines) =>
        currentTransmissionLines.concat({
          id: newTransmissionLineId,
          color: getRandomColor(),
          poles: [firstPole],
          lines: []
        })
      );
      let previousPole = firstPole;
      map.addEventListener('click', (e) => {
        const newPolePosition = e.latlng;
        const { newPole } = addPole(newPolePosition, previousPole, newTransmissionLineId);
        previousPole = newPole;
      });
    });
  }

  $: if ($isDrawing.value) {
    map.getContainer().style.cursor = 'crosshair';
  } else if (isDragging) {
    map.getContainer().style.cursor = 'grabbing';
  } else {
    map.getContainer().style.cursor = 'grab';
  }
</script>

<div class="map" bind:this={mapContainer}>
  <!-- Draw Menu -->
  <div bind:this={drawMenu}>
    <div class="ctrl shadow-lg bg-white flex flex-col">
      <button
        class="draw-btn"
        aria-label="Draw Point (m)"
        on:click|stopPropagation={createTransmissionLine}
      >
        <img
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI5LjMzNCAyOS4zMzQiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTE0LjY2NiwwQzYuNTc4LDAsMCw2LjU4LDAsMTQuNjY3czYuNTc4LDE0LjY2NywxNC42NjYsMTQuNjY3czE0LjY2OC02LjU4LDE0LjY2OC0xNC42NjdTMjIuNzU0LDAsMTQuNjY2LDB6DQoJCSBNMTQuNjY2LDI1LjMzNEM4Ljc4NCwyNS4zMzQsNCwyMC41NDksNCwxNC42NjdTOC43ODQsNCwxNC42NjYsNGM1Ljg4MywwLDEwLjY2OCw0Ljc4NSwxMC42NjgsMTAuNjY3UzIwLjU0NywyNS4zMzQsMTQuNjY2LDI1LjMzNA0KCQl6IE0xOS4zMzIsMTQuNjY3YzAsMi41NzctMi4wODksNC42NjctNC42NjYsNC42NjdjLTIuNTc2LDAtNC42NjYtMi4wODktNC42NjYtNC42NjdDMTAsMTIuMDksMTIuMDksMTAsMTQuNjY2LDEwDQoJCUMxNy4yNDMsMTAsMTkuMzMyLDEyLjA5LDE5LjMzMiwxNC42Njd6Ii8+DQo8L2c+DQo8L3N2Zz4="
          alt="pole"
        />
      </button>
    </div>
  </div>

  <!-- Draw/Edit Actions -->
  <div bind:this={drawActions}>
    <div class={cn({ hidden: !$isDrawing.value })}>
      <button
        on:click|preventDefault|stopPropagation={handleSaveChanges}
        class="btn variant-filled-secondary rounded-md"
      >
        Save
      </button>
      <button
        on:click|preventDefault|stopPropagation={handleUndoChanges}
        class="btn variant-ringed-secondary rounded-md bg-white"
      >
        Cancel
      </button>
    </div>
  </div>

  <slot />
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

  :global(.leaflet-tooltip) {
    @apply bg-transparent shadow-none border-none;
  }

  :global(.leaflet-tooltip::before) {
    @apply hidden;
  }

  :global(.leaflet-popup-tip) {
    @apply hidden;
  }

  .map {
    height: 100vh;
    width: 100vw;
  }
</style>
