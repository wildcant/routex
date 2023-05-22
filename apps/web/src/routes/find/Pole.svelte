<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy, onMount } from 'svelte';
  import { clickoutside } from '../../actions/clickoutside';
  import { assets } from './map-config';
  import { addPole } from './map-utils';
  import { isDrawing, transmissionLines } from './stores';
  import type { ExtendedPole } from './types';

  export let id: string;
  export let transmissionLineId: string;
  export let lat: number;
  export let lng: number;
  export let color: string;

  let map: L.Map = getContext('leafletMapInstance');
  let poleActions: HTMLDivElement;
  let poleData: HTMLDivElement;

  const poleIcon = (color: string) =>
    L.icon({
      iconUrl: assets.icons.pole.url(color),
      iconSize: assets.icons.pole.size,
      className: color
    });

  const marker = L.marker([lat, lng], { icon: poleIcon(color) }).addTo(map);

  $: marker.setLatLng({ lat, lng });

  onMount(() => {
    const tooltip = L.tooltip({ permanent: true, direction: 'top', interactive: true })
      .setLatLng([lat, lng])
      .setContent(poleActions)
      .openOn(map);
    marker.bindTooltip(tooltip).closeTooltip();

    const popup = L.popup().setLatLng([lat, lng]).setContent(poleData).openOn(map);
    marker.bindPopup(popup).closePopup();

    marker.addEventListener('contextmenu', () => {
      // Allow editing only if the map is not in drawing mode already.
      if (!$isDrawing.value) {
        marker.openTooltip();
      }
    });
  });

  onDestroy(() => {
    marker.remove();
  });

  function handleBranchAction() {
    marker.closeTooltip();
    isDrawing.set({ value: true, mode: 'edit', transmissionLineId });
    let previousPole: ExtendedPole = { id, transmissionLineId, lng, lat };

    map.addEventListener('click', (e) => {
      const newPolePosition = e.latlng;
      const { newPole } = addPole(newPolePosition, previousPole, transmissionLineId);
      previousPole = newPole;
    });
  }

  function handleMoveAction() {
    marker.closeTooltip();
    isDrawing.set({ value: true, mode: 'edit', transmissionLineId });
    marker.dragging?.enable();
    marker.on('drag', (e) => {
      const latlng = (e as unknown as L.LeafletMouseEvent).latlng;
      transmissionLines.update((currentTransmissionLines) =>
        currentTransmissionLines.map((transmissionLine) => {
          if (transmissionLine.id !== transmissionLineId) return transmissionLine;
          // Update pole position
          const updatedPole: ExtendedPole = {
            id,
            lat: latlng.lat,
            lng: latlng.lng,
            transmissionLineId
          };

          const poles = transmissionLine.poles.map((p) => {
            if (p.id !== id) return p;
            return updatedPole;
          });

          // Update lines that start or end in this node
          const lines = transmissionLine.lines.map((l) => {
            if (l.startPoleId === id) return { ...l, start: updatedPole };
            if (l.endPoleId === id) return { ...l, end: updatedPole };
            return l;
          });

          return {
            ...transmissionLine,
            poles,
            lines
          };
        })
      );
    });
  }

  function handleDeletePole() {
    marker.closeTooltip();
    isDrawing.set({ value: true, mode: 'edit', transmissionLineId });
    transmissionLines.update((currentTransmissionLines) =>
      currentTransmissionLines.map((transmissionLine) => {
        if (transmissionLine.id !== transmissionLineId) return transmissionLine;
        // remove pole.
        const poles = transmissionLine.poles.filter((p) => p.id !== id);

        // There can only be on line that ends in a given pole but there can be a lot of lines that start on a given pole.
        // so we need to find all the lines that starts with the pole that we are deleting and update the start property with the start pole of the line that ends with the current pole.
        const lineEndPole = transmissionLine.lines.find((l) => l.endPoleId === id);
        if (!lineEndPole)
          throw new Error(
            'TODO: Handle unexpected error, there is no lines that ends on this pole.'
          );

        const lines = transmissionLine.lines
          // Remove the line that ends on this pole
          .filter((l) => l.endPoleId !== id)
          .map((l) => {
            if (l.startPoleId !== id) return l;
            // Update the lines that start on this pole
            return { ...l, start: lineEndPole.start };
          });

        return {
          ...transmissionLine,
          poles,
          lines
        };
      })
    );
  }

  // Disable dragging if map is is not in drawing mode.
  $: if (!$isDrawing.value && marker.dragging?.enabled()) {
    marker.dragging.disable();
  }
</script>

<div bind:this={poleData}>
  <h6>Pole {id}</h6>
  <hr />
</div>

<div
  bind:this={poleActions}
  use:clickoutside
  on:clickoutside={() => marker.closeTooltip()}
  on:click|preventDefault|stopPropagation
  on:keydown
  on:keyup
>
  <div class="flex flex-col items-center mb-4 space-y-2">
    <button
      type="button"
      data-tooltip-target="tooltip-copy"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
      on:click={handleDeletePole}
    >
      <!-- TODO: Add icon that represent deleting a pole. -->
      <div>delete</div>
      <span class="sr-only">Delete</span>
    </button>

    <button
      type="button"
      data-tooltip-target="tooltip-copy"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
      on:click={handleMoveAction}
    >
      <!-- TODO: Add icon that represent moving a pole. -->
      <div>move</div>
      <span class="sr-only">Move</span>
    </button>

    <button
      type="button"
      data-tooltip-target="tooltip-copy"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
      on:click={() => {
        navigator.clipboard.writeText(id);
        marker.closeTooltip();
      }}
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
      type="button"
      data-tooltip-target="tooltip-copy"
      data-tooltip-placement="left"
      on:click={handleBranchAction}
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
