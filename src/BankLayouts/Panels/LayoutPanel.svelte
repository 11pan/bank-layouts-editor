<script>
	import ItemGrid from '../Components/ItemGrid.svelte';
	import ItemList from '../Components/ItemList.svelte';
	import { ACTIVE_TAB } from "../Utility/stores";
	import { Tabs, Tab } from 'svelma';

	let active = $ACTIVE_TAB;

	const ChangeTab = (value) => active = value;

	$: ChangeTab($ACTIVE_TAB)
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
