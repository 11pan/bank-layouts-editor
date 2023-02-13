<script>
	import ItemGrid from '../Components/ItemGrid.svelte';
	import ItemList from '../Components/ItemList.svelte';
	import { Tabs, Tab } from 'svelma';

	let active = 1;
</script>

<Tabs bind:active style="is-fullwidth">
	<Tab label='Tag' icon='tag'>
		<ItemList />
	</Tab>

	<Tab label='Layout' icon='th-large'>
		<ItemGrid />
	</Tab>
</Tabs>


<style>
	:global(.tab-content) {
		overflow-x: visible;
	}
</style>
