import types from "./types";

/** @internal */
const selectors: Record<(typeof types)[number], string> = {
  active: ":active",
  checked: ":checked",
  disabled: ":disabled",
  "even-child": ":nth-child(even)",
  "first-child": ":first-child",
  focus: ":focus",
  "focus-visible": ":focus-visible",
  "focus-within": ":focus-within",
  hover: ":hover",
  "last-child": ":last-child",
  "odd-child": ":nth-child(odd)",
};

export default selectors;
