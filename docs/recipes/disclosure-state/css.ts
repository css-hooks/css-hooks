import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";

export const { styleSheet, on } = createHooks(
  "&:open",
  ":focus-visible &",
  ":open &",
  "%dark",
);
