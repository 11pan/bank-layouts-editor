<script>
	import SettingsPanel from './SettingsPanel.svelte';
	import SearchPanel from './SearchPanel.svelte';
	import LayoutPanel from './LayoutPanel.svelte';
	import SavedLayoutsPanel from './SavedLayoutsPanel.svelte';

	import {  } from 'svelma';
</script>

<div class='columns'>
	<div class='column is-3'>
		<SettingsPanel/>

		<SearchPanel />
	</div>

	<div class='column is-6'>
		<LayoutPanel />
	</div>

	<div class='column is-3'>
		<SavedLayoutsPanel/>
	</div>
</div>
