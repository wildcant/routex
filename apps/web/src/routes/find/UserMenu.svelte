<script lang="ts">
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { popup, storePopup } from '@skeletonlabs/skeleton';
  import L from 'leaflet';
  import { getContext, onMount } from 'svelte';
  import type { PageData } from './$types';

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  let userMenu: HTMLDivElement;
  let map: L.Map = getContext('leafletMapInstance');
  let user: PageData['user'] = getContext('user');

  onMount(() => {
    L.Control.UserMenu = L.Control.extend<Pick<L.Control, 'onAdd'>>({ onAdd: () => userMenu });
    L.control.userMenu = (opts) => new L.Control.UserMenu(opts);
    L.control.userMenu({ position: 'topright' }).addTo(map);
  });
</script>

<div
  bind:this={userMenu}
  on:click|stopPropagation
  on:keydown|stopPropagation
  on:keypress|stopPropagation
  on:dblclick|stopPropagation
>
  <button
    class="btn-icon"
    use:popup={{
      event: 'click',
      target: 'user-menu',
      placement: 'bottom',
      closeQuery: '.menu-item'
    }}
  >
    <figure class="avatar">
      <!-- TODO: Add user avatar image. -->
      <!-- 
      <img
        class="avatar-image rounded-full w-16"
        width="200"
        src="https://i.pravatar.cc/?img=48"
        alt="avatar"
      /> 
      -->
      <div
        class="avatar-image w-8 h-8 rounded-full bg-slate-600 flex justify-center items-center text-white"
      >
        {user?.name.charAt(0)}
      </div>
    </figure>
  </button>

  <div class="card w-48 shadow-xl p-2 bg-white rounded-md" data-popup="user-menu">
    <div id="speed-dial-menu-top-right" class="flex flex-col items-center bg-white">
      <form action="/logout" method="POST">
        <button
          class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-primary-500 hover:text-white menu-item"
        >
          Logout
        </button>
      </form>
    </div>

    <div class="arrow bg-white" />
  </div>
</div>
