<script lang="ts">
	import { enhance } from '$app/forms';
	import CompanyForm from '../CompanyForm.svelte';
	import CompanyFormHeader from '../CompanyFormHeader.svelte';
	import CompanyNavigation from '../CompanyNavigation.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<CompanyNavigation currentPage="New" />

<article>
	<CompanyFormHeader title="New Company" errorMessage={form?.errorMessage} error={form?.error} />
	<CompanyForm formState={{ errors: form?.errors }} submitLabel="Create" />
</article>
