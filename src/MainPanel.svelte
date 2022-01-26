<script>
	import SettingsPanel from './SettingsPanel.svelte';
	import SearchPanel from './SearchPanel.svelte';
	import LayoutPanel from './LayoutPanel.svelte';
	import {  } from 'svelma';
</script>

<div class='columns'>
	<div class='column is-two-fifths'>
		<SettingsPanel/>

		<SearchPanel />
	</div>

	<div class='column'>
		<LayoutPanel />
	</div>
</div>
