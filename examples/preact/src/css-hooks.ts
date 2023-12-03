import { createHooks, recommended } from "@css-hooks/preact";

export const [hooks, css] = createHooks({
  ...recommended,
  dark: "@media (prefers-color-scheme: dark)",
});
