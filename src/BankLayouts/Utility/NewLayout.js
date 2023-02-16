import { LAYOUTS, ACTIVE_LAYOUT } from "./stores.js";
import { get } from "svelte/store";

import { LoadLayout } from "./LoadLayout.js";

export const NewLayout = async (confirmed) => {
  const $LAYOUTS = get(LAYOUTS);

  if (confirmed) {
    let layouts = JSON.parse($LAYOUTS || "[]");

    let save_object = {
      id: Math.random().toString(26).slice(2),
      name: "New layout",
      icon: 952,
      layout_string: "banktaglayoutsplugin:New layout,banktag:New layout,952,",
    };

    layouts.push(save_object);
    LAYOUTS.update((value) => (value = JSON.stringify(layouts)));
    ACTIVE_LAYOUT.update((value) => (value = save_object));
    LoadLayout(save_object.layout_string);
  }
};
