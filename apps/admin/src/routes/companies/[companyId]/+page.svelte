<script lang="ts">
	import CompanyForm from '../CompanyForm.svelte';
	import CompanyNavigation from '../CompanyNavigation.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<CompanyNavigation currentPage="Edit" />

<article>
	<header>
		<h1>Edit Company</h1>
	</header>

	<CompanyForm data={data.form} submitLabel="Update" />
</article>
