<!-- Handle routing -->

<script>
	import page from 'page';
	import BankLayoutsApp from './BankLayouts/BankLayoutsApp.svelte';
	import FragmentApp from './FragmentPicker/FragmentApp.svelte';
	import { PATH } from './BankLayouts/Utility/stores';

	const localDevelopmentDebugUrl = "https://banklayouts.com/?layout=D1AzDysuWQNkAmYBGjFMHkHiK5MNR9MbHoABHgHmLgXMajHwACeygslOAGrkuBANwd1RrkAE7VAAHVAAd2ludGVydG9kdAB3aW50ZXJ0b2R0";
	const referrer = document.referrer.includes("localhost") ? localDevelopmentDebugUrl : document.referrer;

	console.log(document.referrer)

	$PATH = referrer.substring(referrer.indexOf("com") + 3);
	let component;


	if ($PATH != "") 
		window.history.replaceState(null, "", $PATH)

	switch($PATH) {
		case "":
			component = BankLayoutsApp;
			break;
		case "/fragments":
			component = FragmentApp;
			break;
		default:
			component = BankLayoutsApp;
	}

	page.start();
</script>


<svelte:component this={component} />
