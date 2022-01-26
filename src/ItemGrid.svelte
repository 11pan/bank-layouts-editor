<script>
	import ItemSlot from "./ItemSlot.svelte";
	import { itemContainer } from "./container";
	import { SLOTS } from "./stores"

	$SLOTS['grid'] = new Array(16*8).fill(-1);
</script>

<div class='grid'>
	{#each $SLOTS['grid'] as item, idx}
		<div
			on:contextmenu|preventDefault={ e => { $SLOTS['grid'][idx] = -1; } }

			use:itemContainer = {{}}
			on:drop = { e => {
				if (e.detail.source == "grid")
				$SLOTS['grid'][e.detail.slotID] = item;
				$SLOTS['grid'][idx] = e.detail.itemID;
			}}
		>

			<ItemSlot
				container={"grid"}
				itemID={item}
				slotID={idx}
			/>
		</div>
	{/each}
</div>


<style>
	.grid {
		display: grid;
		grid-template-columns: auto auto auto auto auto auto auto auto;
		overflow:visible;
	}
</style>
