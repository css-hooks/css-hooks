import { createHooks, recommended } from "@css-hooks/solid";

export const [hooks, css] = createHooks({
  ...recommended,
  dark: "@media (prefers-color-scheme: dark)",
});
