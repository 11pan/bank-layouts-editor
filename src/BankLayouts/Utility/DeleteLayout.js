import { TAG_NAME, LAYOUTS, ACTIVE_LAYOUT } from "./stores.js";
import { get } from "svelte/store";

import { LoadLayout } from "./LoadLayout";

export const DeleteLayout = async () => {
  const $LAYOUTS = get(LAYOUTS);
  const $ACTIVE_LAYOUT = get(ACTIVE_LAYOUT);

  let layouts = JSON.parse($LAYOUTS || "[]");
  let index = layouts.findIndex((x) => x.id === $ACTIVE_LAYOUT.id);

  layouts.splice(index, 1);
  LAYOUTS.update((value) => (value = JSON.stringify(layouts)));
  ACTIVE_LAYOUT.update((value) => (value = {}));

  LoadLayout("");
  TAG_NAME.update((value) => (value = ""));
};
