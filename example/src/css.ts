import { createHooks } from "@css-hooks/react";

export const { styleSheet, on, and } = createHooks(
  "&:hover",
  "&:active",
  "@media (prefers-color-scheme: dark)",
);
