import { createHooks, recommended } from "@css-hooks/solid";

const [css, hooks] = createHooks({
  ...recommended,
  dark: "@media (prefers-color-scheme: dark)",
} as const);

export default hooks;
export { css };
