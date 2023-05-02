<script lang="ts">
	import CompanyForm from '../CompanyForm.svelte';
	import CompanyFormHeader from '../CompanyFormHeader.svelte';
	import CompanyNavigation from '../CompanyNavigation.svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;
</script>

<CompanyNavigation currentPage="Update" />

<article>
	<CompanyFormHeader title="Edit Company" errorMessage={form?.errorMessage} error={form?.error} />
	<CompanyForm
		formState={{ errors: form?.errors, defaultValues: data.company }}
		submitLabel="Update"
	/>
</article>
