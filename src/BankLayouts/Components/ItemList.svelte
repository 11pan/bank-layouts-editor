<script>
	import ItemSlot from "./ItemSlot.svelte";
	import { itemContainer } from "../Utility/container";
	import { SLOTS } from "../Utility/stores"

	$SLOTS['items'] = new Array(16*8).fill(-1);
	$SLOTS['taggedItems'] = [];

	
	const bgColor = "rgb(63, 63, 63)", highlightColor = "rgb(102, 102, 102)";
	export let highlighted = false;

	const addItem = id => {
		$SLOTS['taggedItems'] = [...new Set([...$SLOTS['taggedItems'], id])];

		if (!$SLOTS['grid'])
			$SLOTS['grid'] = [];

		var all_items_set = new Set([...$SLOTS['grid'], ...$SLOTS['taggedItems']]);
		all_items_set.delete(-1);
		var all_items = [...all_items_set];

		$SLOTS['items'].fill(-1);
		for (var i = 0; i < all_items.length; i++)
			$SLOTS['items'][i] = all_items[i];
	}

	const removeItem = id => {
		$SLOTS['taggedItems'] = $SLOTS['taggedItems'].filter(e => e != id);

		for (var i = 0; i < $SLOTS['grid'].length; i++)
			if ($SLOTS['grid'][i] == id)
				$SLOTS['grid'][i] = -1;
	}

	const onUpdate = (...args) => {
		addItem(-1);
	}

	$: onUpdate($SLOTS['items'], $SLOTS['grid']);

</script>

<div class='grid'
	style="background-color: {highlighted ? highlightColor : bgColor};"
	on:mouseenter = { e => { highlighted = true; }}
	on:mouseleave = { e => { highlighted = false; }}
	use:itemContainer = {{}}
	on:drop = { e => { addItem(e.detail.itemID); }}
>

	{#each $SLOTS['items'] as item, idx}
		<div
			on:contextmenu|preventDefault={ e => { removeItem($SLOTS['items'][idx]); } }
		>

			<ItemSlot
				container={"items"}
				itemID={item}
				slotID={idx}
				background={false}
			/>
		</div>
	{/each}
</div>


<style>
	.grid {
		display: grid;
		grid-template-columns: auto auto auto auto auto auto auto auto;
		border-radius: 3px;
	}
</style>
