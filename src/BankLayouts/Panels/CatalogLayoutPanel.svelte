<script>
  import ItemTagCatalog from '../Components/ItemTagCatalog.svelte';
	import LayoutCatalog from '../Components/LayoutCatalog.svelte';
	import TagCatalog from '../Components/TagCatalog.svelte';
	import { ACTIVE_CATALOG_TAB } from "../Utility/stores";
	import { Tabs, Tab, Progress } from 'svelma';


	let active = 1;

	$: $ACTIVE_CATALOG_TAB = active;

</script>

<Tabs bind:active style="is-fullwidth">
	<Progress max="100"/>
	<Tab label='Bank Tags' icon='tag'>
		<TagCatalog/>
	</Tab>

	<Tab label='Item Tags' icon='tag'>
		<ItemTagCatalog/>
	</Tab>

	<Tab label='Layouts' icon='th-large'>
		<LayoutCatalog/>
	</Tab>
</Tabs>


<style>
	:global(.tab-content) {
		overflow-x: visible;
	}

</style>
