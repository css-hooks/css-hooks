import { createHooks } from "@css-hooks/qwik";

export const [hooks, css] = createHooks({
  "&:hover": "&:hover",
  "&:active": "&:active",
  "@media (prefers-color-scheme: dark)": "@media (prefers-color-scheme: dark)",
});
