<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar background="bg-slate-50">
  <svelte:fragment slot="lead">(Logo)</svelte:fragment>
  <svelte:fragment slot="trail">
    <form action="/logout" method="POST">
      <button class="btn btn-primary">Logout</button>
    </form>
  </svelte:fragment>
</AppBar>

<slot />
