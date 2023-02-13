<script>
	// import ItemSearch from "./ItemSearch.svelte";
	// import ItemGrid from "./ItemGrid.svelte"

	import { getItems } from "./Utility/stores.js"
	const promise = getItems();


	import MainPanel from './Panels/MainPanel.svelte'

</script>

	{#await promise}
		Loading...
	{:then items}
		<div class='section'>
			<div class='container'>
				<MainPanel />
			</div>
		
		</div>
	{:catch error}
		There was an error: {JSON.stringify(error)}.
	{/await}


<style>

</style>
