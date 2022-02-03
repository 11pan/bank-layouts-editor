<script>
	export let container;
	export let itemID;
	export let slotID;
	export let background = true;
	
	import Icon from "./Icon.svelte";
	import { draggable } from 'svelte-drag'
	import { createEventDispatcher } from "svelte";
	import { globalDispatch } from './container.js'
	import { ITEM_MAP } from "./stores.js"
	
	const dispatch = createEventDispatcher();
	const bgColor = "rgb(63, 63, 63)", highlightColor = "rgb(102, 102, 102)";
	
	export let dragging = false;
	export let highlighted = false;
	let x = 0, y = 0;

	const getItem = id => {
		if (id in $ITEM_MAP)
			return $ITEM_MAP[id];
		else
			return $ITEM_MAP[0];
	}

</script>





<div
	class="container"
	style="--background-color: {background ? (highlighted ? highlightColor : bgColor) : ''};"
	on:mouseenter = { e => { highlighted = true; }}
	on:mouseleave = { e => { highlighted = false; }}
	>

	<div class="slot">
		{#if itemID >= 0}
			<div
				use:draggable = {{ position: { y, x } }}
				on:svelte-drag:start = { () => { dragging = true; } }
				on:svelte-drag = {e => { x = e.detail.offsetX; y = e.detail.offsetY; }}
				on:svelte-drag:end = { () => { dragging = false; x = 0; y = 0; globalDispatch('drop', { source: container, itemID: itemID, slotID: slotID }); } }
				style='pointer-events: {dragging ? "none" : "all"}; {dragging ? "z-index: 9999999;" : ""}'
				title={getItem(itemID).name}
				on:touchmove|preventDefault
			>
				<div class="item"><Icon id={itemID}/></div>
				<div class="item-text">{itemID}</div>	
			</div>
		{/if}
	</div>
</div>


<style>
	.container {
		background-color: var(--background-color);
		height: 0;
		padding-bottom: 100%;

		margin: 2px;
		/* border-radius: 3px; */
		position: relative;
		border-radius: 3px;
	}

	.slot {
		position: absolute;
		text-align: center;
		height: 90%;
		width: 90%;
		margin-top: 5%;
		margin-left: 5%;
		display: flex;
		justify-content: center;
		align-content: center;
		flex-direction: column;
		
		color: #FFF;
		font-size: 10pt;


		/* background-color: rgb(199, 199, 199); */
	}

	.item {
		height: 80%;
		width: 80%;
		margin-left: 10%;
		margin-top: 5%;
	}

	.item-text {
		position: absolute;
		text-align: center;
		vertical-align: bottom;
		width: 100%;
		/* height: 100%; */
	}
</style>
