<script>

export let items;

</script>

<nav>
	<div class="nav nav-tabs" id="nav-tab" role="tablist">
		{#each items as item, id}
		<button class="nav-link {id == 0 ? 'active' : ''}" id="nav-{item.code}-tab" data-bs-toggle="tab" data-bs-target="#nav-{item.code}" type="button" role="tab" aria-controls="nav-{item.code}" aria-selected="true">{item.label}</button>
		{/each}
	</div>
</nav>

<div class="tab-content p-3 border" id="nav-tabContent" style="border-top:none !important;">
	{#each items as item, id}
	<div class="tab-pane fade {id == 0 ? 'show active' : ''} " id="nav-{item.code}" role="tabpanel" aria-labelledby="nav-{item.code}-tab">{@html item.content}</div>
	{/each}
</div>
