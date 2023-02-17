<script>
	import SettingsPanel from './SettingsPanel.svelte';
	import SearchPanel from './SearchPanel.svelte';
	import LayoutPanel from './LayoutPanel.svelte';
	import SavedLayoutsPanel from './SavedLayoutsPanel.svelte';
	import CatalogLayoutPanel from './CatalogLayoutPanel.svelte';
	import CatalogSettingsPanel from './CatalogSettingsPanel.svelte';
	import { SHOW_CATALOG_PANEL } from "../Utility/stores";

</script>

<!--
	If you're wondering "Hey, whats with the weird display css fuckery"
	Svelte deletes the components if you "disable" them by normal means
	and for everything to work properly like a well oiled machine,
	we can't have it delete the other panels while showing the catalog panel
	so this was the 3 course spaghetti meal I came up with
-->

<div class='columns'>
	<div class='column is-3'>
		<div style="display: {$SHOW_CATALOG_PANEL ? "none" : ""};">
			<SettingsPanel/>

			<SearchPanel />
		</div>

		{#if $SHOW_CATALOG_PANEL == true}
			<CatalogSettingsPanel/>
		{/if}
	</div>

	<div class='column is-6'>
		<div style="display: {$SHOW_CATALOG_PANEL ? "none" : ""};">
			<LayoutPanel/>
		</div>

		{#if $SHOW_CATALOG_PANEL == true}
			<CatalogLayoutPanel/>
		{/if}
	</div>

	<div class='column is-3'>
		<div style="display: {$SHOW_CATALOG_PANEL ? "none" : ""};">
			<SavedLayoutsPanel/>
		</div>
	</div>
</div>
