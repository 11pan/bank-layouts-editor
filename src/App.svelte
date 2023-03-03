<!-- Handle routing -->

<script>
	import page from 'page';
	import BankLayoutsApp from './BankLayouts/BankLayoutsApp.svelte';
	import FragmentApp from './FragmentPicker/FragmentApp.svelte';

	const path = document.referrer.substring(document.referrer.indexOf("com") + 3);
	const queryString = window.location.search;
	console.log(queryString)
	let component;

	if (path != "")
		window.history.replaceState(null, "", `${path}${queryString}`)

	switch(path) {
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
