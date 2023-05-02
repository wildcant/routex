<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { closeModal, openModal, setModalIsLoading } from '../../stores';
	import type { PageData } from './$types';
	import toast from 'svelte-french-toast';

	export let data: PageData;
	const openConfirmDeleteCompanyModal = (companyId: number) =>
		openModal({
			content: 'Are you sure you want to delete this company?',
			primaryButtonProps: {
				onClick: () => {
					setModalIsLoading.on();
					fetch(`/api/companies/${companyId}`, { method: 'DELETE' })
						.then((r) => r.json())
						.then((data: { success?: boolean; message?: string }) => {
							if (!data.success) {
								toast.error(data.message ?? 'There was a problem trying to delete this company.');
								return;
							}
							toast.success('The company was deleted successfully.');
							invalidateAll();
							closeModal();
						})
						.catch((error) => {
							let errorMessage = `There was a problem trying to delete this company.`;
							if (error instanceof Error) {
								errorMessage.concat(error.message);
							}
							toast.error(errorMessage);
							closeModal();
						})
						.finally(setModalIsLoading.off);
				}
			}
		});
</script>

<nav aria-label="breadcrumb">
	<ul>
		<li><a href="/">Home</a></li>
		<li>Companies</li>
	</ul>
</nav>

<br />

<header>
	<div class="row middle-xs between-xs">
		<h1>Companies</h1>
		<a href="/companies/new" role="button">New</a>
	</div>
</header>

<br />

<table>
	<thead>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">Hash</th>
			<th scope="col">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each data.companies as company (company.id)}
			<tr>
				<td>{company.name}</td>
				<td>{company.hash}</td>
				<td class="row end-xs" style="gap: 6px;">
					<a class="icon-button text-yellow" href={`/companies/${company.id}`}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M15.7279 9.57629L14.3137 8.16207L5 17.4758V18.89H6.41421L15.7279 9.57629ZM17.1421 8.16207L18.5563 6.74786L17.1421 5.33365L15.7279 6.74786L17.1421 8.16207ZM7.24264 20.89H3V16.6474L16.435 3.21233C16.8256 2.8218 17.4587 2.8218 17.8492 3.21233L20.6777 6.04075C21.0682 6.43128 21.0682 7.06444 20.6777 7.45497L7.24264 20.89Z"
							/>
						</svg>
					</a>
					<button
						class="icon-button text-red-700"
						on:click={() => openConfirmDeleteCompanyModal(company.id)}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"
							/>
						</svg>
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
