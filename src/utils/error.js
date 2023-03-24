import _get from "lodash.get";

export function getErrorMessage(e = {}) {
  const message = _get(e, "data.message") || "";
  const status = _get(e, "status") || "";

  const url = _get(e, "config.url") || "";
  let interfaceUrl = "";
  let special = "xinaohealth";
  let index = url.indexOf(special);
  if (index > -1) {
    interfaceUrl = url.slice(index + special.length, url.length);
  }

  return `${message}${status ? "," + status : ""}${interfaceUrl ? ",接口:" + interfaceUrl : ""}`;
}
