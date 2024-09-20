import { createHooks } from "@css-hooks/solid";

export const { styleSheet, on, and } = createHooks(
  "&:hover",
  "&:active",
  "@media (prefers-color-scheme: dark)",
);
