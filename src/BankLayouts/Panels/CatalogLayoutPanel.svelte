<script>
	import LayoutCatalog from '../Components/LayoutCatalog.svelte';
	import TagCatalog from '../Components/TagCatalog.svelte';
	import { ACTIVE_CATALOG_TAB, getCatalog, LAYOUT_CATALOG, TAG_CATALOG } from "../Utility/stores";
	import { Tabs, Tab, Progress } from 'svelma';

	let promise;

	if (Object.entries($LAYOUT_CATALOG).length < 1 && Object.entries($TAG_CATALOG).length < 1) 
		promise = getCatalog();

	let active = 1;

	$: $ACTIVE_CATALOG_TAB = active;

</script>

<Tabs bind:active style="is-fullwidth">
	{#await promise}
		<Progress max="100"/>
	{:then items} 
		<Tab label='Tags' icon='tag'>
			<TagCatalog/>
		</Tab>

		<Tab label='Layouts' icon='th-large'>
			<LayoutCatalog/>
		</Tab>
	{:catch error}
		There was an error while trying to load the catalog: {JSON.stringify(error)}.
	{/await}
</Tabs>


<style>
	:global(.tab-content) {
		overflow-x: visible;
	}

</style>
