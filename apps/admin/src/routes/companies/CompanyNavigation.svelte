<script lang="ts">
	export let currentPage: string;
</script>

<nav aria-label="breadcrumb">
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/companies">Companies</a></li>
		<li>{currentPage}</li>
	</ul>
</nav>
