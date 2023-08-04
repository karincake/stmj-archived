<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let items;
	export let opt = {};
	export let itemOpt = {};
	export let navOpt = {};
	export let indicatorOpt = {};
	export let clickPreventDefaultStatus = false;
	export let calculated = false;

	// Some basic var after export
	const itemCount = items.length;

	// opt basic validation
	if(typeof opt.autoplay == 'undefined') opt.autoplay = false;
	if(typeof opt.boxCssClass == 'undefined') opt.boxCssClass = '';
	if(typeof opt.displayCssClass == 'undefined') opt.displayCssClass = '';
	if(typeof opt.railCssClass == 'undefined') opt.railCssClass = '';
	if(typeof opt.infinitySlide == 'undefined') opt.infinitySlide = false;

	// itemOpt basic validation
	if(typeof itemOpt.displayCount == 'undefined' || !itemOpt.displayCount)  itemOpt.displayCount = 1;
	if(typeof itemOpt.displayCountScale != 'object') itemOpt.displayCountScale = 6;
	if(typeof itemOpt.gapSize == 'undefined') itemOpt.gapSize = 20;
	if(typeof itemOpt.slideCount == 'undefined' || itemOpt.slideCount > itemOpt.displayCount) itemOpt.slideCount = 1;

	// nav opt basic validation
	if(typeof navOpt.status == 'undefined') navOpt.status = true;
	if(typeof navOpt.toLeftIcon == 'undefined') navOpt.toLeftIcon = 'bi bi-chevron-left';
	if(typeof navOpt.toRightIcon == 'undefined') navOpt.toRightIcon = 'bi bi-chevron-right';

	// indicatorOpt basic validation, since it is using false as default, we only check if it is true
	if(indicatorOpt.status == true) {
		if(typeof indicatorOpt.position == 'undefined') {
			indicatorOpt.position = 'bottom';
		}
		if(typeof indicatorOpt.mode == 'undefined') {
			indicatorOpt.mode = 'dot';
		}
	}

	// opt advance validation
	let fillerItems = [];
	if(itemOpt.displayCount != itemOpt.slideCount) {
		opt.autoplay = false;
		itemOpt.infinitySlide = false;
	}
	if(opt.autoplay) {
		itemOpt.infinitySlide = true;
		if(typeof opt.autoplayDuration == 'undefined') opt.autoplayDuration = 3000;
		for(let i = 0; i < itemOpt.displayCount; i++) {
			fillerItems[i] = items[i];
		}
		fillerItems = items.splice();
	}
	if(itemOpt.infinitySlide) {
		// items.
	}

	// draging
	let xStartPos = 0;
	let xStartTime = 0;
	let lastRailLeftMargin = 0;

	// navigating
	let navigated = false; // prevent auto play for a periode after being navigated

	// reactive
	let boxWidth, boxHeight, windowInnerWidth, windowInnerHeight;
	let itemMargin = itemOpt.gapSize / 2;
	let railLeftIdx = 0;
	const railLeftMargin = tweened(0, { duration: 300, easing: cubicOut });
	$: itemWidth = (boxWidth - (itemOpt.gapSize * (itemOpt.displayCount-1))) / itemOpt.displayCount;
	$: itemGroupWidth = itemWidth * itemOpt.slideCount;
	$: itemScopeWidth = itemWidth + itemOpt.gapSize;
	$: railWidth = itemCount * (itemWidth + itemOpt.gapSize) + itemOpt.gapSize;
	$: navButtonTopPos = boxHeight / 2 - 30;
	$: railMaxLeftIdx = itemCount > itemOpt.displayCount ? itemCount - itemOpt.displayCount - 1 : 1;
	$: railLeftMargin.set(-(railLeftIdx * itemScopeWidth));
	$: calculated = railWidth && itemWidth ? true : false;

	// based on breakpoints
	$: if(Object.keys(itemOpt.displayCountScale).length > 0 && windowInnerWidth) {
		for (const prop in itemOpt.displayCountScale) {
			if(windowInnerWidth >= prop) {
				itemOpt.displayCount = itemOpt.displayCountScale[prop]
			}
		}
	}

	function scrollLeft(count) {
		if(railLeftIdx > 0) {
			railLeftIdx -= count
		}
	}

	function scrollRight(count) {
		if(railLeftIdx <= railMaxLeftIdx) {
			railLeftIdx += count;
		}
	}

	function railMouseEnter(event) {
	}

	function railMouseLeave(event) {
	}

	function railMouseMove(event) {
		if(clicked) {
			$railLeftMargin = lastRailLeftMargin + (event.clientX - xStartPos);
		}
	}

	function railMouseOver(event) {
	}

	function railMouseDown(event) {
		clicked = true;
		navigated = true;
		lastRailLeftMargin = $railLeftMargin;
		xStartPos = event.clientX;
		xStartTime = new Date().getTime();
	}

	function railMouseUp(event) {
		clicked = false;
		if(Math.abs(xStartPos - event.clientX) > 2) {
			clickPreventDefaultStatus = true;
			const draggeDistance = event.clientX - xStartPos;
			const percentDdToIgw = draggeDistance / itemGroupWidth;
			const xEndTime = new Date().getTime();
			const xDuration = xEndTime - xStartTime;
			if((percentDdToIgw > 0.5) || (percentDdToIgw > 0.25 && xDuration <= 250)) {
				scrollLeft(itemOpt.slideCount);
			} else if(percentDdToIgw < -0.5 || (percentDdToIgw < -0.25 && xDuration <= 250)) {
				scrollRight(itemOpt.slideCount);
			} else {
				railLeftMargin.set(-(railLeftIdx * itemScopeWidth));
			}
		} else {
			clickPreventDefaultStatus = false;
		}
	}

	function windowMouseUp() {
		railLeftMargin.set(-(railLeftIdx * itemScopeWidth));
		clicked = false;
	}

	let clicked = false;
	if(opt.autoplay) {
		setInterval(function() {
			if(navigated) {
				navigated = false;
				return;
			}
			if(!clicked) {
				if(railLeftIdx <= railMaxLeftIdx) {
					scrollRight(itemOpt.slideCount);
				} else {
					railLeftIdx = 0;
				}
			}
		}, opt.autoplayDuration);
	}
</script>

<svelte:window bind:innerWidth={windowInnerWidth} bind:innerHeight={windowInnerHeight} on:mouseup={windowMouseUp} />

<div bind:clientWidth={boxWidth} bind:clientHeight={boxHeight} class="carousel-box {opt.boxCssClass}">
	{#if calculated}
		<div transition:fly="{{ y: -30, duration: 200 }}" class="item-display {opt.boxCssClass}" style="margin-left:-{itemMargin}px; margin-right:-{itemMargin}px;">
			<div class="rail d-flex {opt.railCssClass}" style="width:{railWidth}px; margin-left:{$railLeftMargin}px"
				on:mouseenter={railMouseEnter}
				on:mouseleave={railMouseLeave}
				on:mousemove={railMouseMove}
				on:mousedown|preventDefault={railMouseDown}
				on:mouseup={railMouseUp}
			>
					{#each items as item }
						<div style="{`width:${itemWidth}px;`} {`margin-left:${itemMargin}px; margin-right:${itemMargin}px;`}"
						>
							<slot {item} />
						</div>
					{/each}
			</div>
		</div>
		{#each fillerItems as item }
			<slot {item} />
		{/each}
		{#if navOpt.status}
			<div class="navigator-box">
				<button on:click={() => scrollLeft(itemOpt.slideCount)} class="position-absolute to-left" style="top:{navButtonTopPos}px">
					<i class="{navOpt.toLeftIcon}"></i>
				</button>
				<button on:click={() => scrollRight(itemOpt.slideCount)} class="position-absolute to-right" style="top:{navButtonTopPos}px">
					<i class="{navOpt.toRightIcon}"></i>
				</button>
			</div>
		{/if}
		{#if indicatorOpt.status}
			<div class="indicator-box text-center {indicatorOpt.position} {indicatorOpt.mode}">
				{#if indicatorOpt.mode == 'dot'}
					{@const navIndex = Array.apply(null, Array((itemCount - itemOpt.displayCount + 1) / itemOpt.slideCount)).map(function (_, i) {return i;})}
					{#each navIndex as item, i}
						<button type="button" on:click={() => railLeftIdx = i * itemOpt.slideCount} class="{i == railLeftIdx / itemOpt.slideCount ? 'active':''}"></button>
					{/each}
				{:else if indicatorOpt.mode == 'thumbnail'}
					{#if typeof indicatorOpt.src == 'object'}
						{#each indicatorOpt.src as item, i}
							<div type="button" on:click={() => railLeftIdx = i * itemOpt.slideCount} class="{i == railLeftIdx / itemOpt.slideCount ? 'active':''}" aria-current="{i == 0 ? 'true':''}" >
								<img src={item} class="w-100" alt="" />
							</div>
						{/each}
					{:else}
						{#each items as item, i}
							<div type="button" on:click={() => railLeftIdx = i * itemOpt.slideCount} class="{i == railLeftIdx / itemOpt.slideCount ? 'active':''}" aria-current="{i == 0 ? 'true':''}" >
								<img src={item.imgThumbSrc} class="w-100" alt="" />
							</div>
						{/each}
					{/if}
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.carousel-box {
		position: relative;
	}
	.item-display { overflow-x: hidden; }
	.navigator-box > * {
		width:42px;
		height:42px;
		font-size:24px;
		border-radius: 50%;
		border:unset;
		box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
		background-color: rgba(255,255,255,.75)!important;
	}
	.navigator-box .to-left{
		left:-16px;
	}
	.navigator-box .to-right{
		right:-16px;
	}
	.indicator-box{
		width:100%;
		position: absolute;
		display: flex;
		justify-content: center;
	}
	.indicator-box.bottom-outside{
		position: relative;
		background-color: #ddd;
	}
	.indicator-box.bottom {
		bottom:10px;
	}
	.indicator-box.dot>* {
		width:20px;
		width:16px;
		height:16px;
		margin: 0px 2px;
		border:unset;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		border-top: unset;
		border-bottom: unset;
		box-shadow: 0 .1rem .5rem rgba(0,0,0,.75)!important;
		background-color: rgba(255,255,255,1)!important;
	}
	.indicator-box.dot>*.active {
		width:40px;
	}
	.indicator-box.thumbnail>* {
		width:60px;
		margin-left:2px;
		margin-right:2px;
		box-shadow: 0 .1rem .5rem rgba(0,0,0,.25)!important;
		background-color: rgba(255,255,255,1)!important;
	}
	.indicator-box.thumbnail>*>img {
		opacity: 0.35;
	}
	.indicator-box.thumbnail>*.active>img {
		opacity: 1;
	}

</style>
