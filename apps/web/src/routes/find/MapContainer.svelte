<script lang="ts">
  import Map from './Map.svelte';
  import TransmissionLine from './TransmissionLine.svelte';
  import UserMenu from './UserMenu.svelte';
  import { transmissionLines } from './stores';
</script>

<Map>
  <UserMenu />
  {#each $transmissionLines as transmissionLine (transmissionLine.id)}
    <TransmissionLine {...transmissionLine} />
  {/each}
</Map>
