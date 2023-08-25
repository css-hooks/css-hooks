import types from "@hooks.css/core/src/types";

function pseudo(pseudo: string) {
  return (offProp: string, onProp: string) => `
*:not(${pseudo}) {
  ${offProp}: initial;
  ${onProp}: ;
}
*${pseudo} {
  ${offProp}: ;
  ${onProp}: initial;
}
`;
}

/** @internal */
const rules: Record<
  (typeof types)[number],
  (offProp: string, onProp: string) => string
> = {
  active: pseudo(":active"),
  autofill: pseudo(":autofill"),
  checked: pseudo(":checked"),
  default: pseudo(":default"),
  dark: (offProp, onProp) => `
:root {
  ${offProp}: initial;
  ${onProp}: ;
}

@media (prefers-color-scheme:dark) {
  :root {
    ${offProp}: ;
    ${onProp}: initial;
  }
}
`,
  disabled: pseudo(":disabled"),
  empty: pseudo(":empty"),
  enabled: pseudo(":enabled"),
  "even-child": pseudo(":nth-child(even)"),
  "first-child": pseudo(":first-child"),
  "first-of-type": pseudo(":first-of-type"),
  focus: pseudo(":focus"),
  "focus-visible": pseudo(":focus-visible"),
  "focus-within": pseudo(":focus-within"),
  hover: pseudo(":hover"),
  "in-range": pseudo(":in-range"),
  indeterminate: pseudo(":indeterminate"),
  invalid: pseudo(":invalid"),
  "last-child": pseudo(":last-child"),
  "last-of-type": pseudo(":last-of-type"),
  "odd-child": pseudo(":nth-child(odd)"),
  "only-child": pseudo(":only-child"),
  "only-of-type": pseudo(":only-of-type"),
  "out-of-range": pseudo(":out-of-range"),
  "placeholder-shown": pseudo(":placeholder-shown"),
  "read-only": pseudo(":read-only"),
  required: pseudo(":required"),
  target: pseudo(":target"),
  valid: pseudo(":valid"),
  visited: pseudo(":visited"),
};

export default rules;
