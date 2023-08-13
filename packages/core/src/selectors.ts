import types from "./types";

/** @internal */
const selectors: Record<
  (typeof types)[number],
  (selectorBase: string) => string
> = {
  active: x => `${x}:active`,
  autofill: x => `${x}:autofill`,
  checked: x => `${x}:checked`,
  default: x => `${x}:default`,
  disabled: x => `${x}:disabled`,
  empty: x => `${x}:empty`,
  enabled: x => `${x}:enabled`,
  "even-child": x => `${x}:nth-child(even)`,
  "first-child": x => `${x}:first-child`,
  "first-of-type": x => `${x}:first-of-type`,
  focus: x => `${x}:focus`,
  "focus-visible": x => `${x}:focus-visible`,
  "focus-within": x => `${x}:focus-within`,
  hover: x => `${x}:hover`,
  "in-range": x => `${x}:in-range`,
  indeterminate: x => `${x}:indeterminate`,
  invalid: x => `${x}:invalid`,
  "last-child": x => `${x}:last-child`,
  "last-of-type": x => `${x}:last-of-type`,
  "odd-child": x => `${x}:nth-child(odd)`,
  "only-child": x => `${x}:only-child`,
  "only-of-type": x => `${x}:only-of-type`,
  "out-of-range": x => `${x}:out-of-range`,
  "placeholder-shown": x => `${x}:placeholder-shown`,
  "read-only": x => `${x}:read-only`,
  required: x => `${x}:required`,
  target: x => `${x}:target`,
  valid: x => `${x}:valid`,
  visited: x => `${x}:visited`,
};

export default selectors;
