<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy, onMount } from 'svelte';
  import { assets } from './map-config';
  import { addPole } from './map-utils';
  import { isDrawing } from './stores';

  export let transmissionLineId: string;
  export let lat: number;
  export let lng: number;
  export let color: string;

  let map: L.Map = getContext('leafletMapInstance');

  const poleIcon = (color: string) =>
    L.icon({
      iconUrl: assets.icons.pole.url(color),
      iconSize: assets.icons.pole.size,
      className: color
    });

  const marker = L.marker([lat, lng], { icon: poleIcon(color) }).addTo(map);
  let poleActions: HTMLDivElement;
  let branchAction: HTMLButtonElement;

  function handleBranchAction() {
    marker.closePopup();
    isDrawing.set({ value: true, mode: 'edit', transmissionLineId });
    let previousPolePosition = [lng, lat];
    map.addEventListener('click', (e) => {
      const newPolePosition = [e.latlng.lng, e.latlng.lat];
      addPole(newPolePosition, previousPolePosition, transmissionLineId);
      previousPolePosition = newPolePosition;
    });
  }

  onMount(() => {
    let popup = L.popup({ closeButton: false })
      .setLatLng([lat, lng])
      .setContent(poleActions)
      .openOn(map);

    marker.bindPopup(popup).closePopup();

    marker.addEventListener('contextmenu', () => {
      // Allow adding only one branch at a time.
      if (!$isDrawing.value) {
        marker.openPopup();
        branchAction.addEventListener('click', handleBranchAction, { once: true });
      }
    });
  });

  onDestroy(() => {
    marker.remove();
  });
</script>

<div bind:this={poleActions}>
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
      bind:this={branchAction}
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
