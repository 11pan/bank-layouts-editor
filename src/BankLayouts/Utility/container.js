export function itemContainer(node) {
	let entered = false;

	node.addEventListener('mouseenter', () => { entered =  true; });
	node.addEventListener('mouseleave', () => { entered = false; });

	document.addEventListener('drop', (event) => {
		if (entered)
			node.dispatchEvent(new CustomEvent('drop', { 'detail': event.detail }));
	});
}


export function globalDispatch(name, detail) {
	document.dispatchEvent(new CustomEvent(name, { 'detail': detail }));
}
