import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";

export const { styleSheet, on, and, or, enable, disable } =
  createHooks(
    "&:has([value=system]:checked)",
    "&:has([value=dark]:checked)",
    "%dark",
  );
