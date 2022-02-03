<script>
	import { Field, Input } from 'svelma';
	import ItemSlot from './ItemSlot.svelte';
	import { ITEM_MAP, SLOTS } from "./stores";
	import { itemContainer } from "./container";

	import Fuse from 'fuse.js';

	$SLOTS['search'] = [];

	const SEARCH_LIMIT = 80;

	const data = Object.values($ITEM_MAP).filter(item => (!item.duplicate && item.type == 'normal'));
	const randomItem = () => data[Math.floor(Math.random() * data.length)];

	const fuse = new Fuse(data, { keys: ['name'] });

	const updateSlots = result => {
		if (!result) return;
		$SLOTS['search'] = [];
		
		for (var i = 0; i < result.length; i++)
			$SLOTS['search'].push(result[i].item.id);
	}
	const search = text => { updateSlots(fuse.search(text, { limit: SEARCH_LIMIT })); }


	let searchText = '';
	$: search(searchText);

</script>


<div class='section'>
	<Field label='Item Search'>
		<Input placeholder={randomItem().name} bind:value={searchText}/>
	</Field>
</div>

<div class='grid'>
	{#each $SLOTS['search'] as item, idx}
		<div
			use:itemContainer
			on:drop = { e => { if (e.detail.source != "search") $SLOTS[e.detail.source][e.detail.slotID] = -1; } }
			>
			<ItemSlot container={"search"} itemID={item} slotID={idx} />
		</div>
	{/each}
</div>


<style>
	.grid {
		display: grid;
		grid-template-columns: auto auto auto auto auto;
	}
</style>
