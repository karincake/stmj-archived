<script>
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import * as svelte from 'svelte';

	// export let data = {};
	export let show = false;
	export let width = null;
	export let size = null;
	export let headerVis = true;
	export let footerVis = true;
	export let xBtnVis = true;
	export let closeBtnVis = true;
	export let okBtnVis = true;
	export let backdrop = false;

	const dispatch = createEventDispatcher();
	const previously_focused = typeof document !== 'undefined' && document.activeElement;
	let modal;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}

	function close(){
		show = false;
		dispatch('close');
	};
	function ok(){
		dispatch('ok');
	};

	function handle_keydown(e) {
		if(!show) {
			return;
		}

		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			console.log('hit');
			if(modal) {
				// trap focus
				const nodes = modal.querySelectorAll('*');
				const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);
				console.log(tabbable);

				let index = tabbable.indexOf(document.activeElement);
				if (index === -1 && e.shiftKey) index = 0;

				index += tabbable.length + (e.shiftKey ? -1 : 1);
				index %= tabbable.length;

				tabbable[index].focus();
				e.preventDefault();
			}
		}
	};
</script>

<svelte:window on:keydown={handle_keydown}/>

{#if show}
	<div class="modal modal-background" on:click={() => backdrop ? close() : false } transition:fade="{{ duration: 100 }}">
		<div class="modal-dialog modal-dialog-centered {size && !width ? ' modal-' + size : ''}" style="{width ? 'width:' + width + 'px !important;' : ''}" >
			<div class="modal-content" bind:this={modal}>
				{#if headerVis}
				<div class="modal-header py-3 h6 fw-600 mb-0">
					<slot name="title" />
					{#if xBtnVis}
					<button type="button" on:click={close} class="btn-close" aria-label="Close"></button>
					{/if}
				</div>
				{/if}
				<div class="modal-body">
					<slot />
				</div>
				{#if footerVis}
				<div class="modal-footer">
					{#if closeBtnVis}
					<button type="button" on:click={close} class="btn bg-grey-400"><i class="bi bi-x-lg me-1"></i> Tutup</button>
					{/if}
					{#if okBtnVis}
					<button type="button" on:click={ok} class="btn bg-primary-400"><i class="bi bi-check-lg me-1"></i> OK</button>
					{/if}
				</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5);
		z-index: 2000;
	}
	.modal {
		z-index: 2200;
		display:block;
	}
</style>
