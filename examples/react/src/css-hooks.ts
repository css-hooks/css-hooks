import { createHooks, recommended } from "@css-hooks/react";

const [css, hooks] = createHooks({
  ...recommended,
  dark: "@media (prefers-color-scheme: dark)",
} as const);

export default hooks;
export { css };
