<script lang="ts">
	import UserForm from '../UserForm.svelte';
	import UserNavigation from '../UserNavigation.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<UserNavigation currentPage="New" />

<article>
	<header>
		<h1>New User</h1>
	</header>

	<UserForm data={data.form} submitLabel="Create" companies={data.companies} />
</article>
