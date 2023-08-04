<script>
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { clickOutside } from '../common-snippets/mouse.js';

	// item
	export let showToggler = true;
	export let showMenu = false;
	export let label = '';
	export let icon = '';
	// menu
	export let menuCompactMode = 'compact';
	export let menuUsesIcon = true;
	export let menuWidth = 250;
	export let menuWidthBp = null;
	export let menuAlign = 'left';
	export let menuPos = null;
	export let menuPosBp = null;
	export let menuClass = null;

	const dispatch = createEventDispatcher();
	let windowInnerWidth;
	let clickedOutsideStatus = false;

	menuCompactMode = (menuCompactMode == 'compact' || menuCompactMode == 'super-compact') ? menuCompactMode : '';
	menuAlign = (menuAlign == 'left' || menuAlign == 'right' || menuAlign == 'center') ? menuAlign : '';
	const menuIconize = menuUsesIcon ? 'iconize' : '';

	$: if(menuWidthBp && windowInnerWidth) {
		if(windowInnerWidth < 576) {
			menuWidth = menuWidthBp[0] ? menuWidthBp[0] : 0;
		} else if(windowInnerWidth < 758) {
			menuWidth = menuWidthBp[576] ? menuWidthBp[576] : 0;
		} else if(windowInnerWidth < 992) {
			menuWidth = menuWidthBp[758] ? menuWidthBp[758] : 0;
		} else if(windowInnerWidth < 1200) {
			menuWidth = menuWidthBp[992] ? menuWidthBp[992] : 0;
		} else if(windowInnerWidth < 1400) {
			menuWidth = menuWidthBp[1200] ? menuWidthBp[1200] : 0;
		} else {
			menuWidth = menuWidthBp[1400] ? menuWidthBp[1400] : 0;
		}
	}
	$: if(menuPosBp && windowInnerWidth) {
		if(windowInnerWidth < 576) {
			menuPos = menuPosBp[0] ? menuPosBp[0] : 0;
		} else if(windowInnerWidth < 758) {
			menuPos = menuPosBp[576] ? menuPosBp[576] : 0;
		} else if(windowInnerWidth < 992) {
			menuPos = menuPosBp[758] ? menuPosBp[758] : 0;
		} else if(windowInnerWidth < 1200) {
			menuPos = menuPosBp[992] ? menuPosBp[992] : 0;
		} else if(windowInnerWidth < 1400) {
			menuPos = menuPosBp[1200] ? menuPosBp[1200] : 0;
		} else {
			menuPos = menuPosBp[1400] ? menuPosBp[1400] : 0;
		}
	}
	$: if(showMenu){
		dispatch('show');
	};
	$: menuWidthStyle = typeof menuWidth == 'number' ? `width:${menuWidth}px;` : ''; 
	$: menuPosStyle = typeof menuPos == 'number' ? `${menuAlign}:${menuPos}px;` : '';

	function toggleMenu(event) {
		if(event.isTrusted) {
			if(!clickedOutsideStatus) {
				showMenu = !showMenu;
			} else {
				clickedOutsideStatus = false;
				showMenu = false;
			}
		} else {
			showMenu = false;
			clickedOutsideStatus = true;
			setTimeout(function(){
				clickedOutsideStatus = false;
			},10);
		}
	}

	function clickedOutside(event) {
		toggleMenu(event);
	}

	function clickedInside(event) {
		if(event.srcElement.nodeName == 'A') {
			showMenu = false;
			clickedOutsideStatus = false;
		}
	}
</script>

<svelte:window bind:innerWidth={windowInnerWidth} />

{#if showToggler}
<div on:click={toggleMenu} class="nav-link pointer {label ? 'no-width' : 'fix-width' } ">
	{#if icon}<i class="{icon}"></i>{/if}
	{#if label}<span>{label}</span>{/if}
</div>
{/if}

{#if showMenu}
<div transition:fly="{{ y: -20, duration: 200 }}" use:clickOutside on:click_outside={clickedOutside} on:click={clickedInside}
	class="dropdown-menu {`dropdown-menu-${menuAlign}`} position-absolute shadow-sm show {menuCompactMode} {menuIconize} {menuClass} " 
	style="{menuWidthStyle} {menuPosStyle}"
>
	<slot></slot>
</div>
{/if}

<style>
	.nav-link {
		white-space: nowrap;
	}
	.nav-link.no-width {
		width: unset;
	}
	.dropdown-menu-end {
		right:0px;
	}
	.dropdown-menu-center{
		left: 50%;
		right: auto;
		transform: translate(-50%, 0);
	}
</style>