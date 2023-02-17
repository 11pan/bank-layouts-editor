import { compressLayoutStr } from "./compress";
import { Toast } from "svelma";

export const GetIcon = (string, isTag) => {
  if (isTag) {
    return string.split(",")[1];
  } else {
    let icon = string.substring(string.indexOf("banktag:"));
    icon = icon.substring(icon.indexOf(",") + 1).split(",")[0];
    return icon;
  }
};

export const GetName = (string, isTag) => {
  if (isTag) {
    return string.split(",")[0];
  } else {
    return string.substring(string.indexOf(":") + 1).split(",")[0];
  }
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
