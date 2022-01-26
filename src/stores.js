import { writable } from 'svelte/store';

export const ITEM_MAP = writable({});
export const SLOTS    = writable({});
export const TAG_NAME = writable('');


const item_names_url = "https://raw.githubusercontent.com/osrsbox/osrsbox-db/master/docs/items-search.json";

export const getItems = async () => {
	let response = await fetch(item_names_url);
	let items = await response.json();

	ITEM_MAP.set(items);

	return items;
}


