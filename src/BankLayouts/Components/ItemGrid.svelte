<script>
	import ItemSlot from "./ItemSlot.svelte";
	import { itemContainer } from "../Utility/container";
	import { SLOTS } from "../Utility/stores"

	const W = 8;

	$SLOTS['grid'] = new Array(16*W).fill(-1);
	
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

				if (idx >= ($SLOTS['grid'].length - W))
					$SLOTS['grid'] = $SLOTS['grid'].concat(new Array(W).fill(-1));
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
