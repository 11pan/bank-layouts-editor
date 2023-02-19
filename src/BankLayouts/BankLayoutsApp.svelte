<script>
	import { WELCOME_POPUP, SLOTS } from "./Utility/stores.js"
	import { fade } from 'svelte/transition'

	import MainPanel from './Panels/MainPanel.svelte'
	import LoadingPanel from './Panels/LoadingPanel.svelte'

	import { Notification } from 'svelma';

	import { getItems } from "./Utility/stores"
	import { LoadLayout } from "./Utility/LoadLayout"
	import { decompressLayoutStr } from "./Utility/compress";

	let itemsPromise = getItems();
	let loadedFromUrl = false;

	if ($WELCOME_POPUP === "true") {
		Notification.create({message: 'Welcome to bank layout editor!<br><br>' + 
		'This editor can be used to create or modify bank layouts<br>' + 
		'for the Bank Tag Layouts Runelite plugin.<br><br>' + 
		'Please ensure you have Bank Tag Layouts plugin installed<br>' + 
		'Before you try exporting a layout into Runelite.<br><br>' + 
		'If you encounter any issues or have suggestions,<br>' + 
		'please create an issue ticket on <a href="https://github.com/11pan/bank-layouts-editor">Github</a>.<br><br>' + 
		'<small>(This popup will not be shown again once you close it)</small>', position: "is-bottom-left", duration: 3600000 })

		document.getElementsByClassName("delete")[0].onclick = () => $WELCOME_POPUP = "false";
	}

	const LoadLayoutFromQueryString = () => {

		const urlParams = new URLSearchParams(window.location.search);
		const compressedLayoutString = urlParams.get("layout");

		if (compressedLayoutString && $SLOTS.grid && !loadedFromUrl) {
				LoadLayout(decompressLayoutStr(compressedLayoutString));
				loadedFromUrl = true;
		}
	};

	$: LoadLayoutFromQueryString($SLOTS.grid);

	
</script>

{#await itemsPromise}
	<LoadingPanel/>
{:then items} 
	<div transition:fade class='section'>
		<div class='container'>
			<MainPanel />
		</div>
	</div>
{:catch itemError}
	There was an error: {JSON.stringify(itemError)}.
{/await}