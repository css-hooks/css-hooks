import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";

export const { styleSheet, on, and } = createHooks(
  "&:hover",
  "&:focus-visible",
  "&:active",
  "&:disabled",
  "@media (hover: hover)",
  "@media (prefers-reduced-motion: no-preference)",
  "%dark",
);
