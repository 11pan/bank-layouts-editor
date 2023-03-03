<!-- Handle routing -->

<script>
	import page from 'page';
	import BankLayoutsApp from './BankLayouts/BankLayoutsApp.svelte';
	import FragmentApp from './FragmentPicker/FragmentApp.svelte';

	let pages = {
		'': BankLayoutsApp,
		'fragments': FragmentApp
	}

	let component = BankLayoutsApp;

	page((ctx) => {
		if (ctx.hash in pages) {
			var value = pages[ctx.hash];
			component = value;
			ctx.handled = true;
		}
	});

	console.log(document.referrer)

	page.start();
</script>


<svelte:component this={component} />
