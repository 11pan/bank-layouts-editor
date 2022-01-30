<!-- Handle routing -->

<script>
	import page from 'page';
	import BankLayoutsApp from './BankLayoutsApp.svelte';
	import FragmentApp from './fragments/FragmentApp.svelte';

	let pages = {
		'/': BankLayoutsApp,
		'/fragments': FragmentApp
	}

	let component;

	for (const [key, value] of Object.entries(pages)) {
		page(key, (ctx) => { component = value; });
	}

	page.start();
</script>


<svelte:component this={component} />
