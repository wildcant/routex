<script lang="ts">
  import Map from './Map.svelte';
  import TransmissionLine from './TransmissionLine.svelte';
  import UserMenu from './UserMenu.svelte';
  import { transmissionLines } from './stores';
</script>

<Map>
  <UserMenu />
  {#each $transmissionLines as { id, poles, lines, color } (id)}
    <TransmissionLine {lines} {poles} {color} />
  {/each}
</Map>
