<script>
	import { createEventDispatcher } from 'svelte';
	import Header from '../data-header/data-header.svelte';

	export let headerColumns = [];
	export let dataColumns = [];
	export let breakPoint = 'sm'; // since this uses bootstrap's breakpoints
	export let items = [];
	export let idKey = 'id';
	export let headerStatus = false;
	export let searchStatus = true;
	export let searchVal = '';
	export let searchPlaceholder = null;
	export let filterStatus = true;
	export let addStatus = true;
	export let modifyStatus = true;

	const dispatch = createEventDispatcher();

	let innerWidth;
	let calculated = false;
	let breakPointStatus = false;
	let navWidth = 80;
	let boxWidth;
	let columnDefaultWidth;

	$: {
		columnDefaultWidth = `${(boxWidth - navWidth) / headerColumns.length}px`
	}
	$: if(innerWidth) {
		breakPointStatus = 
			(breakPoint == 'xxl' && innerWidth >= 1400) ? true :
			(breakPoint == 'xl' && innerWidth >= 1200) ? true :
			(breakPoint == 'lg' && innerWidth >= 992) ? true :
			(breakPoint == 'md' && innerWidth >= 768) ? true :
			(breakPoint == 'sm' && innerWidth > 576) ? true : false;
		calculated = true;
	}

	function showEdit(id) {
		const obj = {};
		obj[idKey] = id;
		dispatch('showEdit', obj);
	}

	function confirmDelete(id) {
		const obj = {};
		obj[idKey] = id;
		dispatch('confirmDelete', obj);
	}
</script>

{#if headerStatus}
	<Header
		{searchStatus} {searchPlaceholder} bind:searchVal on:search={() => dispatch('search')}
		{filterStatus} on:showFilter={() => dispatch('showFilter')} 
		{addStatus} on:showAdd={() => dispatch('showAdd')} 
	/>
{/if}

<svelte:window bind:innerWidth={innerWidth} />

<div bind:clientWidth={boxWidth} class="{breakPointStatus ? 'border shadow-1' : ''}">
	{#if calculated && breakPointStatus}
		<div class="header border-bottom d-flex">
			{#each headerColumns as item}
				{@const width = item.width ? `${item.width}` : columnDefaultWidth}
				<div class="p-2" style="width:{width}">{item.label}</div>
			{/each}
			{#if modifyStatus}
				<div style="width:60px"></div>
			{/if}
		</div>
	{/if}
	{#if calculated}
		{#each items as item}
			<div class="{breakPointStatus ? 'border-bottom p-2' : 'border mb-3 shadow p-3'}  {breakPointStatus ? 'd-flex': ''}">
				{#each dataColumns as itemData, idx}
					{@const width = headerColumns[idx].width ? `${headerColumns[idx].width}` : columnDefaultWidth }
					<div style="width:{breakPointStatus ? width : '100%' }">{item[itemData]}</div>
				{/each}
				{#if modifyStatus}
					<div class="text-center" styl='width:80px'>
						<i on:click={() => showEdit(item[idKey]) } class="bi bi-pencil me-2 pointer"></i>
						<i on:click={() => confirmDelete(item[idKey]) } class="bi bi-trash pointer"></i>
					</div>
				{/if}
				<slot {item} />
			</div>	
		{/each}
	{/if}
</div>

<style>
	.header {
		font-weight: 600;
	}
</style>
