import { createHooks, recommended } from "@css-hooks/preact";

const [css, hooks] = createHooks({
  ...recommended,
  dark: "@media (prefers-color-scheme: dark)",
});

export default hooks;
export { css };
