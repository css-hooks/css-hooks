import { createHooks } from "@css-hooks/qwik";

export const { styleSheet, on, and } = createHooks(
  "&:hover",
  "&:active",
  "@media (prefers-color-scheme: dark)",
);
