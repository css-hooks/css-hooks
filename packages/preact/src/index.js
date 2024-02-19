// @ts-nocheck

import { buildHooksSystem } from "@css-hooks/core";

const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

export function _stringifyValue(propertyName, value) {
  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return `${value}${
        typeof propertyName === "string" &&
        IS_NON_DIMENSIONAL.test(propertyName)
          ? ""
          : "px"
      }`;
    default:
      return null;
  }
}

export const createHooks = buildHooksSystem(_stringifyValue);
