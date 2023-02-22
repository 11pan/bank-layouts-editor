import {
  SLOTS,
  TAG_NAME,
  SHOW_CATALOG_PANEL,
  ACTIVE_TAB,
  ACTIVE_LAYOUT,
} from "./stores.js";
import { Toast } from "svelma";

SLOTS.update((value) => {
  value.icon = [-1];
  return value;
});

export const LoadLayout = (importText, addToLayout) => {
  try {
    var text = importText;
    var type = "";
    text = text.replace(/-/g, "");

    if (text.includes("banktaglayoutsplugin")) {
      type = "Layout";

      // Load bank layout
      var bankLayoutItems = text.substring(
        text.indexOf("banktaglayoutsplugin:") + 1,
        text.indexOf(",banktag")
      );
      bankLayoutItems = bankLayoutItems.split(",");

      TAG_NAME.update((value) => {
        value = bankLayoutItems[0].split(":")[1];
        return value;
      });

      var banktagItems = text.substring(text.indexOf("banktag:") + 1);
      banktagItems = banktagItems.split(",");

      SLOTS.update((value) => {
        value.icon[0] = parseInt(banktagItems[1]);
        return value;
      });

      var layoutItems = new Set();

      SLOTS.update((value) => {
        value.grid.fill(-1);
        return value;
      });

      for (var i = 1; i < bankLayoutItems.length; i++) {
        var parsed = bankLayoutItems[i].split(":");
        var item = parseInt(parsed[0]);
        var idx = parseInt(parsed[1]);

        SLOTS.update((value) => {
          value.grid[idx] = item;
          return value;
        });

        layoutItems.add(item);
      }

      var tagItems = new Set();

      for (var i = 2; i < banktagItems.length; i++) {
        var item = parseInt(banktagItems[i]);
        if (!layoutItems.has(item)) tagItems.add(item);
      }

      SLOTS.update((value) => {
        value.taggedItems = [...tagItems];
        return value;
      });

      ACTIVE_TAB.update((value) => (value = 1));
    } else {
      type = "Tag";

      // Load bank tag
      var banktagItems = text.split(",");
      SLOTS.update((value) => {
        value.icon[0] = parseInt(banktagItems[1]);
        return value;
      });

      TAG_NAME.update((value) => {
        value = banktagItems[0];
        return value;
      });

      SLOTS.update((value) => {
        value.grid.fill(-1);
        return value;
      });

      var items = [];

      for (var i = 2; i < banktagItems.length; i++)
        items.push(parseInt(banktagItems[i]));

      if (addToLayout) {
        for (var i = 0; i < items.length; i++)
          SLOTS.update((value) => {
            value.grid[i] = items[i];
            return value;
          });

        ACTIVE_TAB.update((value) => (value = 1));
      } else {
        SLOTS.update((value) => {
          value.taggedItems = [...items];
          return value;
        });
        ACTIVE_TAB.update((value) => (value = 0));
      }
    }

    SHOW_CATALOG_PANEL.update((value) => (value = false));

    if (text.includes("New layout")) {
      Toast.create({
        message: type + " created successfully.",
        type: "is-success",
        position: "is-bottom-left",
      });
    } else {
      if (text) {
        Toast.create({
          message: type + " loaded successfully.",
          type: "is-success",
          position: "is-bottom-left",
        });
      }
    }

    ACTIVE_LAYOUT.update((value) => (value = {}));
  } catch (e) {
    console.log(e);
    Toast.create({
      message: "Error importing " + type + ": " + e.message,
      type: "is-danger",
      position: "is-bottom-left",
    });
  }
};
