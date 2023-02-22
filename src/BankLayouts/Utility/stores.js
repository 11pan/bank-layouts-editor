import { writable } from "svelte/store";
import DropTableCatalog from "../../../data/DropTableTagCatalog.json";

export const ITEM_MAP = writable({});

export const SLOTS = writable({});
export const TAG_NAME = writable("");
export const ACTIVE_LAYOUT = writable({});
export const ITEMS_IN_GRID = writable(false);

export const LAYOUT_CATALOG = writable([]);
export const TAG_CATALOG = writable([]);
export const DROP_TABLE_TAG_CATALOG = writable([]);

export const VISIBLE_LAYOUT_CATALOG_ITEMS = writable([]);
export const VISIBLE_TAG_CATALOG_ITEMS = writable([]);

export const SHOW_CATALOG_PANEL = writable(false);

export const ACTIVE_TAB = writable(1);
export const ACTIVE_CATALOG_TAB = writable(1);

export const LAYOUTS = writable(localStorage.getItem("LAYOUTS") || "[]");
LAYOUTS.subscribe((val) => {
  localStorage.setItem("LAYOUTS", val);
});

export const WELCOME_POPUP = writable(
  localStorage.getItem("WELCOME_POPUP") || "true"
);
WELCOME_POPUP.subscribe((val) => {
  localStorage.setItem("WELCOME_POPUP", val);
});

// If you are wondering why we are fetching the files from Github
// instead of just importing them normally, we don't want to have
// the files cached into bundle.js because
// 1) They cannot be modified without needing to build the project every time
// 2) item-db.json is fucking HUGE which bloats the bundle.js file size, slowing the page load significantly

export const getItems = async () => {
  let response = await fetch(
    "https://raw.githubusercontent.com/11pan/bank-layouts-editor/main/data/item-db.json"
  );
  let items = await response.json();

  ITEM_MAP.set(items);

  await getCatalog();
  await getDropTableCatalog();
  return items;
};

export const getCatalog = async () => {
  let response = await fetch(
    "https://raw.githubusercontent.com/11pan/bank-layouts-editor/main/data/BankLayoutCatalog.json"
  );
  let items = await response.json();

  LAYOUT_CATALOG.set(items.layouts);
  TAG_CATALOG.set(items.tags);

  return items;
};

export const getDropTableCatalog = async () => {
  let response = await fetch(
    "https://raw.githubusercontent.com/11pan/bank-layouts-editor/main/data/DropTableTagCatalog.json"
  );
  let items = await response.json();

  DROP_TABLE_TAG_CATALOG.set(DropTableCatalog.tags);

  return items;
};
