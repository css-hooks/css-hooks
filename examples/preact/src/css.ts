import { createHooks } from "@css-hooks/preact";

export const { styleSheet, on, and } = createHooks(
  "&:active",
  "&:hover",
  "@media (prefers-color-scheme: dark)",
);
