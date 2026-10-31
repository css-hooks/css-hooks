import { createHooks } from "@css-hooks/react";

export { mergeStyles } from "@css-hooks/react";

export const { styleSheet, on, and } = createHooks(
  "&:focus",
  ":placeholder-shown + &",
  ":not(:focus) + &",
  "%dark",
);
