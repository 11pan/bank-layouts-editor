import { writable } from "svelte/store";
import itemdb from "../../Data/item-db.json";

export const ITEM_MAP = writable({});
export const SLOTS = writable({});
export const TAG_NAME = writable("");
export const ACTIVE_LAYOUT = writable({});
export const ITEMS_IN_GRID = writable(false);

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

export const getItems = async () => {
  ITEM_MAP.set(itemdb);

  return itemdb;
};
