<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Web App</h1>
<div>
  {#each data?.users as user (user.id)}
    <div>{user.name}</div>
  {/each}
</div>
