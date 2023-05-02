<script lang="ts">
	import { globalErrorMessage } from '../../stores';

	export let title: string;
	export let errorMessage: string | undefined;
	export let error: string | undefined;
	const showError = errorMessage && error;

	if (showError) {
		globalErrorMessage.set(errorMessage);
	}
</script>

<header>
	<h1>{title}</h1>
	{#if showError}
		<div class="alert alert-danger">
			<pre>
        {error}
      </pre>
		</div>
	{/if}
</header>
