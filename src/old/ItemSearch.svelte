<script>
	import Typeahead from "svelte-typeahead";
	import ItemSlot from "./ItemSlot.svelte";
	import { itemContainer } from "./container";
	import { ITEM_MAP, SLOTS } from "./stores";

	$SLOTS['search'] = [];

	// Holds the items json
	let results;
	
	const data = Object.values($ITEM_MAP).filter(item => (!item.duplicate && item.type == 'normal'));

	const updateSlots = result => { if (!result) return; $SLOTS['search'] = []; for (var i = 0; i < result.length; i++) $SLOTS['search'].push(result[i].original.id); }
	const randomItem = () => data[Math.floor(Math.random() * data.length)];

	$: updateSlots(results);

</script>

<Typeahead
	label="Item Search"
	placeholder={randomItem().name}
	{data}
	extract={(item) => item.name}
	limit={48}
	bind:results={results}
	autoselect={false}
	inputAfterSelect="keep"
><div></div></Typeahead>

<div class='grid'>
	{#each $SLOTS['search'] as item, idx}
		<div
			use:itemContainer
			on:drop = { e => { if (e.detail.source != "search") $SLOTS[e.detail.source][e.detail.slotID] = -1; } }
			>
			<ItemSlot
				container={"search"}
				itemID={item}
				slotID={idx}
				/>
		</div>
	{/each}
</div>


<style>
	.grid {
		display: grid;
		grid-template-columns: auto auto auto auto auto;
	}
</style>
