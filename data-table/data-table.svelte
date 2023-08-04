<script>
	import { createEventDispatcher } from 'svelte';
	import Header from '../data-header/data-header.svelte';

	export let headerColumns = [];
	export let dataColumns = [];
	export let items = [];
	export let meta = {};
	export let idKey = 'id';
	export let headerStatus = false;
	export let searchStatus = true;
	export let searchVal = '';
	export let searchPlaceholder = null;
	export let filterStatus = true;
	export let addStatus = true;
	export let modifyStatus = true;

	const dispatch = createEventDispatcher();
	const selectedObj = {};
	selectedObj[idKey] = null;
	
	if(!meta['page']) {
		meta['page'] = 1;
	}
	if(!meta['perpage']) {
		meta['perpage'] = 10;
	}
	var rowStart = (meta['page'] - 1) * meta['perpage'] + 1;

	function renderHeader() {
		let output = ''; 
		if(Array.isArray(headerColumns[0])) {
			headerColumns.forEach(el => {
				el.forEach(el2 => {
					let rowSpan = el.rowSpan ? ` rowspan="${el.rowSpan}"` : '';
					let colSpan = el.colSpan ? ` colspan="${el.colSpan}"` : '';
					let width = el.width ? ` style="width:${el.width}"` : '';
					output += `<th ${rowSpan} ${colSpan} ${width}>${el2.label}</th>`;
				});
			});
		} else {
			output = '<tr>';
			headerColumns.forEach(el => {
				let width = el.width ? `style="width:${el.width}"` : '';
				output += `<th ${width}>${el.label}</th>`;
			});
			if(modifyStatus) {
				output += '<th style="width:60px"></th>';
			}
			output += '</tr>';
		}
		return output;
	}

	function renderData(item, idx) {
		let output = '';
		dataColumns.forEach((el) => {
			if(typeof el ==  'function') {
				output += `<td>${el(item)}</td>`;
			} else {
				if(el != '#idx') {
					output += `<td>${item[el]}</td>`;
				} else {
					output += `<td>${rowStart + idx}</td>`;
				}
			}
		});
		return output;
	}

	function showEdit(id) {
		selectedObj[idKey] = id;
		dispatch('showEdit', obj);
	}

	function confirmDelete(id) {
		selectedObj[idKey] = id;
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

<div class="border">
	<table class="table w-100">
		<thead>
			{@html renderHeader()}
		</thead>
		<tbody>
			{#each items as item, idx}
				<tr>
					{@html renderData(item, idx)}
					{#if modifyStatus}
						<td>
							<i on:click={() => showEdit(item[idKey]) } class="bi bi-pencil me-2 pointer"></i>
							<i on:click={() => confirmDelete(item[idKey]) } class="bi bi-trash pointer"></i>
						</td>
					{/if}
					<slot {item} />
				</tr>	
			{/each}
		</tbody>
	</table>
</div>
