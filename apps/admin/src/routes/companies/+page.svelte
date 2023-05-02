<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
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
				<td>
					<a class="icon-button text-yellow" href={`/companies/${company.id}`}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M15.7279 9.57629L14.3137 8.16207L5 17.4758V18.89H6.41421L15.7279 9.57629ZM17.1421 8.16207L18.5563 6.74786L17.1421 5.33365L15.7279 6.74786L17.1421 8.16207ZM7.24264 20.89H3V16.6474L16.435 3.21233C16.8256 2.8218 17.4587 2.8218 17.8492 3.21233L20.6777 6.04075C21.0682 6.43128 21.0682 7.06444 20.6777 7.45497L7.24264 20.89Z"
							/>
						</svg>
					</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
