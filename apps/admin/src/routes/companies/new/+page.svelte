<script lang="ts">
	import CompanyForm from '../CompanyForm.svelte';
	import CompanyNavigation from '../CompanyNavigation.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<CompanyNavigation currentPage="New" />

<article>
	<header>
		<h1>New Company</h1>
	</header>

	<CompanyForm data={data.form} submitLabel="Create" />
</article>
