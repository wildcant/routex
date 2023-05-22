<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy, onMount } from 'svelte';
  import { clickoutside } from '../../actions/clickoutside';
  import { isDrawing, transmissionLines } from './stores';
  import type { ExtendedLine, ExtendedPole } from './types';
  import { nanoid } from 'nanoid';

  export let transmissionLineId: string;
  export let id: string;
  export let start: { id: string; lat: number; lng: number };
  export let end: { id: string; lat: number; lng: number };
  export let color: string;

  const map: L.Map = getContext('leafletMapInstance');
  let newPolePosition: L.LatLngLiteral;

  const line = L.polyline(
    [
      [start.lat, start.lng],
      [end.lat, end.lng]
    ],
    { color }
  ).addTo(map);

  // Update polyline when start or end changes.
  $: line.setLatLngs([
    [start.lat, start.lng],
    [end.lat, end.lng]
  ]);

  let lineActions: HTMLDivElement;

  onMount(() => {
    const tooltip = L.tooltip({ permanent: true, direction: 'top', interactive: true }).setContent(
      lineActions
    );
    line.bindTooltip(tooltip).closeTooltip();

    line.addEventListener('contextmenu', (e) => {
      line.openTooltip({ lat: e.latlng.lat, lng: e.latlng.lng });
      newPolePosition = e.latlng;
    });
  });

  onDestroy(() => {
    line.remove();
  });

  /** Allow user to insert a new pole in an existing line. */
  function handleInsertPole() {
    isDrawing.set({ value: true, mode: 'edit', transmissionLineId });
    const newPole: ExtendedPole = {
      id: nanoid(11),
      lat: newPolePosition.lat,
      lng: newPolePosition.lng,
      transmissionLineId
    };
    // Split the current line in two.
    const newLineLeft: ExtendedLine = {
      id: nanoid(11),
      start,
      end: newPole,
      startPoleId: start.id,
      endPoleId: newPole.id,
      transmissionLineId
    };
    const newLineRight: ExtendedLine = {
      id: nanoid(11),
      start: newPole,
      end,
      startPoleId: newPole.id,
      endPoleId: end.id,
      transmissionLineId
    };

    transmissionLines.update((currentTransmissionLines) =>
      currentTransmissionLines.map((transmissionLine) => {
        if (transmissionLine.id !== transmissionLineId) return transmissionLine;
        // remove current line from transmission line and add the two new lines and the new pole.
        const lines = transmissionLine.lines.filter((l) => l.id !== id);
        lines.push(newLineLeft);
        lines.push(newLineRight);
        return {
          ...transmissionLine,
          poles: transmissionLine.poles.concat(newPole),
          lines
        };
      })
    );
  }
</script>

<div
  bind:this={lineActions}
  use:clickoutside
  on:clickoutside={() => line.closeTooltip()}
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
      on:click={handleInsertPole}
    >
      <!-- TODO: Add proper icon that represents action. -->
      <div>+</div>
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
