<!-- Handle routing -->

<script>
	import page from 'page';
	import BankLayoutsApp from './BankLayoutsApp.svelte';
	import FragmentApp from './fragments/FragmentApp.svelte';

	let pages = {
		'': BankLayoutsApp,
		'fragments': FragmentApp
	}

	let component = BankLayoutsApp;

	page('/', (ctx) => {
		if (ctx.hash in pages) {
			var value = pages[ctx.hash];
			component = value;
			ctx.handled = true;
		}
	});

	page.start();
</script>


<svelte:component this={component} />
