<script>
	import { createEventDispatcher } from 'svelte';

	export let icon = null;
	export let title = null;
	export let searchStatus = true;
	export let searchVal = '';
	export let searchPlaceholder = 'Search';
	export let filterStatus = true;
	export let addStatus = true;

	let headerWidth;

	const dispatch = createEventDispatcher();
	const navOnly = (!icon && !title) ? true : false;

	function search() {dispatch('search')}
</script>

<div bind:clientWidth={headerWidth} class="d-flex mb-3">
	{#if !navOnly}
		<div class="h6 mb-0 me-auto pt-2 fw-600">
			{#if icon}<i class="{icon}"></i>{/if}
			{title}
		</div>
	{/if}
	<div class="flex-fill">
		<div class="nav-box d-flex {navOnly ? 'nav-only' : 'justify-content-end'}">
			<slot name="preNav" />
			{#if searchStatus}
				<div class="search-box">
					<div class="d-none d-md-block">
						<div class="input-group">
							<input bind:value={searchVal} on:keydown={(e) => { if(e.key === 'Enter') {search()}}} type="text" class="form-control" placeholder="{searchPlaceholder}">
							<span on:click="{search}" class="input-group-text bg-info pointer" id="basic-addon2"><i class="bi bi-search"></i></span>
						</div>
					</div>
					<button class="btn btn-info d-block d-md-none">
						<i class="bi bi-search"></i>
						<span class="d-none d-md-inline">Filter</span>
					</button>
				</div>
			{/if}
			{#if filterStatus}
				<button on:click="{() => dispatch('showFilter')}" class="btn btn-info">
					<i class="bi bi-sliders"></i>
					<span class="d-none d-md-inline">Filter</span>
				</button>
			{/if}
			{#if addStatus}
				<button on:click="{() => dispatch('showAdd')}" class="btn bg-blue">
					<i class="bi bi-plus"></i>
					<span class="d-none d-md-inline">Tambah</span>
				</button>
			{/if}
			<slot name="postNav" />
		</div>
	</div>
</div>

<style>
	@media(max-width: 992px) {
		.nav-only .search-box {
			flex-grow:1;
		}
	}
	@media(min-width: 993px) {
		.search-box, .nav-only .search-box {
			width:50%;
		}
	}
	.nav-box > * {
		margin-right: .5rem;
	}
	.nav-box > *:last-child {
		margin-right: 0px;
	}
</style>
