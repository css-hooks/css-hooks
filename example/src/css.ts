import { createHooks } from "@css-hooks/react";

export const { styleSheet, on, and, not, or } = createHooks(
  "&:hover",
  "@media (prefers-color-scheme: dark)",
  "@media (prefers-reduced-motion: reduce)",
  ".dark &",
  ".auto &",
);

export const dark = or(
  ".dark &",
  and(".auto &", "@media (prefers-color-scheme: dark)"),
);
