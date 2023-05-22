<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy, onMount } from 'svelte';
  import { clickoutside } from '../../actions/clickoutside';
  import { assets } from './map-config';
  import { addPole } from './map-utils';
  import {
    directionsPolyLineEncoded,
    isDrawing,
    selectedPoleId,
    transmissionLines
  } from './stores';
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

  async function handleDisplayDirections() {
    marker.closeTooltip();
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const result = (await (
          await fetch(
            `/api/directions?destination=${lat},${lng}&origin=${coords.latitude},${coords.longitude}`
          )
        ).json()) as {
          success: boolean;
          polylineEncoded: string;
        };
        if (result.success) {
          directionsPolyLineEncoded.set(result.polylineEncoded);
        }
      },
      (err) => {
        console.error('TODO: Handle unexpected error. Was not able to get the user location', err);
        alert('Was not able to get the user location.');
      }
    );
  }

  $: marker.setLatLng({ lat, lng });

  // Disable dragging if map is is not in drawing mode.
  $: if (!$isDrawing.value && marker.dragging?.enabled()) {
    marker.dragging.disable();
  }

  $: if ($selectedPoleId === id) {
    map.flyTo({ lat, lng }, 20);
    marker.openPopup(); // TODO: not working for some reason.
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
      on:click={handleDisplayDirections}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
        <path
          d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"
        />
      </svg>
      <span class="sr-only">directions</span>
    </button>

    <button
      type="button"
      data-tooltip-target="tooltip-copy"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
      on:click={handleDeletePole}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
        <path
          d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
        />
      </svg>
      <span class="sr-only">Delete</span>
    </button>

    <button
      type="button"
      data-tooltip-target="tooltip-copy"
      data-tooltip-placement="left"
      class="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-lg border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
      on:click={handleMoveAction}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
        <path
          d="M18 11V8L22 12L18 16V13H13V18H16L12 22L8 18H11V13H6V16L2 12L6 8V11H11V6H8L12 2L16 6H13V11H18Z"
        />
      </svg>
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
        <path
          d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6">
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
