import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";
export const { styleSheet, on } = createHooks(
  "@container (min-width: 400px)",
  "%dark",
);
