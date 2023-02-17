<script>
	import LayoutCatalog from '../Components/LayoutCatalog.svelte';
	import TagCatalog from '../Components/TagCatalog.svelte';
	import { ACTIVE_CATALOG_TAB } from "../Utility/stores";
	import { Tabs, Tab } from 'svelma';

	let active = 1;

	$: $ACTIVE_CATALOG_TAB = active;

</script>

<Tabs bind:active style="is-fullwidth">
	<Tab label='Tags' icon='tag'>
		<TagCatalog/>
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
