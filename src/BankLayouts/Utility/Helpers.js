import { compressLayoutStr } from "./compress";
import { Toast } from "svelma";

export const GetIcon = (layout) => {
  let icon = layout.substring(layout.indexOf("banktag:"));
  icon = icon.substring(icon.indexOf(",") + 1).split(",")[0];
  return icon;
};

export const GetName = (layout) => {
  return layout.substring(layout.indexOf(":") + 1).split(",")[0];
};

export const Titleize = (s) => s.replace(/^([a-z])/, (_, r) => r.toUpperCase());

export const GetShareUrl = (exportText) => {
  let compressedString = compressLayoutStr(exportText);
  navigator.clipboard.writeText(
    `${window.location.href.split("?")[0]}?layout=${compressedString}`
  );
  Toast.create({
    message: "Link to layout copied successfully",
    type: "is-success",
    position: "is-bottom-left",
  });
};
