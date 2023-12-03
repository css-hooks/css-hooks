import { createHooks, recommended } from "@css-hooks/react";

export const [hooks, css] = createHooks({
  ...recommended,
  dark: "@media (prefers-color-scheme: dark)",
});
