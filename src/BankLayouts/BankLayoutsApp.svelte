<script>
	import { WELCOME_POPUP, SLOTS, SHOW_CATALOG_PANEL } from "./Utility/stores.js"
	import { fade } from 'svelte/transition'

	import MainPanel from './Panels/MainPanel.svelte'
	import LoadingPanel from './Panels/LoadingPanel.svelte'

	import { Notification } from 'svelma';

	import { getItems } from "./Utility/stores"
	import { LoadLayout } from "./Utility/LoadLayout"
	import { decompressLayoutStr } from "./Utility/compress";

	const localDevelopmentDebugUrl = "https://banklayouts.com/browse";
	const referrer = document.referrer.includes("localhost") ? localDevelopmentDebugUrl : document.referrer;

	const path = referrer.substring(referrer.indexOf("com") + 3);

	if (path == "/browse") 
		$SHOW_CATALOG_PANEL = true;

	let itemsPromise = getItems();
	let loadedFromUrl = false;
	let isWelcomePopupVisible = false;

	const ShowWelcomePopup = (val) => {
		if ($WELCOME_POPUP === "true" && val && !isWelcomePopupVisible) {
			Notification.create({message: 'Welcome to bank layout editor!<br><br>' + 
			'This editor can be used to create or modify bank layouts<br>' + 
			'for the Bank Tag Layouts Runelite plugin.<br><br>' + 
			'Please ensure you have Bank Tag Layouts plugin installed<br>' + 
			'Before you try exporting a layout into Runelite.<br><br>' + 
			'If you encounter any issues or have suggestions,<br>' + 
			'please create an issue ticket on <a href="https://github.com/11pan/bank-layouts-editor">Github</a>.<br><br>' + 
			'<small>(This popup will not be shown again once you close it)</small>', position: "is-bottom-left", duration: 3600000 })

			document.getElementsByClassName("delete")[0].onclick = () => $WELCOME_POPUP = "false";
			isWelcomePopupVisible = true;
		}

	}
	const LoadLayoutFromQueryString = () => {

		const urlParams = new URLSearchParams(window.location.search);
		const compressedLayoutString = urlParams.get("layout");

		if (compressedLayoutString && $SLOTS.grid && !loadedFromUrl) {
				LoadLayout(decompressLayoutStr(compressedLayoutString));
				loadedFromUrl = true;
		}
	};

	const ChangeHistoryState = (show) => {
		if (show)
			window.history.replaceState(null, "", `/browse${window.location.search}`)
		else
			window.history.replaceState(null, "", "..")

	}

	$: LoadLayoutFromQueryString($SLOTS.grid);
	$: ShowWelcomePopup($SLOTS.grid)
	$: ChangeHistoryState($SHOW_CATALOG_PANEL);
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