import { SLOTS, TAG_NAME, LAYOUTS, ACTIVE_LAYOUT } from "./stores.js";
import { Toast } from "svelma";
import { get } from "svelte/store";

import { LoadLayout } from "./LoadLayout";
import { GetName, GetIcon } from "./Helpers";

export const SaveLayout = async (newLayout, layoutString, cameFromCatalog) => {
  const $TAG_NAME = get(TAG_NAME);
  const $SLOTS = get(SLOTS);
  const $LAYOUTS = get(LAYOUTS);
  const $ACTIVE_LAYOUT = get(ACTIVE_LAYOUT);

  try {
    var out = "";

    out += "banktaglayoutsplugin:" + $TAG_NAME + ",";

    for (var i = 0; i < $SLOTS["grid"].length; i++)
      if ($SLOTS["grid"][i] >= 0) {
        out += $SLOTS["grid"][i] + ":" + i + ",";
      }

    out += "banktag:";
    var banktag =
      $TAG_NAME + "," + ($SLOTS["icon"][0] >= 0 ? $SLOTS["icon"][0] : 0) + ",";
    banktag += $SLOTS["items"].filter((x) => x >= 0).join(",");

    let layouts = JSON.parse($LAYOUTS || "[]");

    if (newLayout) {
      // SAVES A NEW LAYOUT
      let save_object;

      if (
        $SLOTS["items"].filter((x) => x >= 0).length > 0 &&
        !cameFromCatalog
      ) {
        save_object = {
          id: Math.random().toString(26).slice(2),
          name: $TAG_NAME,
          icon: $SLOTS["icon"][0] >= 0 ? $SLOTS["icon"][0] : 0,
          layout_string: out + banktag,
        };
      } else if (layoutString) {
        save_object = {
          id: Math.random().toString(26).slice(2),
          name: GetName(layoutString),
          icon: GetIcon(layoutString),
          layout_string: layoutString,
        };
      } else {
        save_object = {
          id: Math.random().toString(26).slice(2),
          name: "New layout",
          icon: 952,
          layout_string:
            "banktaglayoutsplugin:New layout,banktag:New layout,952,",
        };
      }

      layouts.push(save_object);
      LAYOUTS.update((value) => (value = JSON.stringify(layouts)));

      if (!layoutString) {
        ACTIVE_LAYOUT.update((value) => (value = save_object));
        LoadLayout(save_object.layout_string);
        Toast.create({
          message: "New layout created.",
          type: "is-success",
          position: "is-bottom-left",
        });
      } else {
        Toast.create({
          message: "Saved catalog layout.",
          type: "is-success",
          position: "is-bottom-left",
        });
      }
    } else {
      // UPDATES THE CURRENT ACTIVE LAYOUT
      let index = layouts.findIndex((x) => x.id === $ACTIVE_LAYOUT.id);

      let save_object = {
        id: $ACTIVE_LAYOUT.id,
        name: $TAG_NAME,
        icon: $SLOTS["icon"][0] >= 0 ? $SLOTS["icon"][0] : 0,
        layout_string: out + banktag,
      };

      layouts[index] = save_object;
      LAYOUTS.update((value) => (value = JSON.stringify(layouts)));
      ACTIVE_LAYOUT.update((value) => (value = save_object));

      Toast.create({
        message: "Layout updated.",
        type: "is-success",
        position: "is-bottom-left",
      });
    }
  } catch (e) {
    Toast.create({
      message: "Error saving layout: " + e.message,
      type: "is-danger",
      position: "is-bottom-left",
    });
  }
};
