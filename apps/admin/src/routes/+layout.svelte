<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import Modal from '../component/Modal.svelte';
	import { globalErrorMessage } from '../stores';

	let error: string | undefined = undefined;
	const closeAlert = () => globalErrorMessage.set(undefined);
	globalErrorMessage.subscribe((msg) => {
		error = msg;
	});
</script>

<main>
	{#if error}
		<div class="alert alert-danger">
			<div class="container">
				<div class="row between-xs">
					<p>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
							<path
								fill="currentColor"
								d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
							/>
						</svg>
						{error}
					</p>

					<button class="icon-button text-red" on:click={closeAlert}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	{/if}

	<div class="container">
		<div class="row">
			<aside class="col-xs-2">
				<nav>
					<ul>
						<li>Routex</li>
						<hr />
						<li><a href="/companies">Companies</a></li>
						<li><a href="/users">Users</a></li>
					</ul>
				</nav>
			</aside>

			<div class="col-xs-offset-1 col-xs-9">
				<slot />
			</div>
		</div>
	</div>
</main>

<Modal />
<Toaster
	position="bottom-center"
	toastOptions={{ style: 'border-radius: 200px; background: #333; color: #fff;' }}
/>

<style>
	div.container {
		padding: 1rem 0px;
	}
	aside {
		padding: 0px;
	}
</style>
