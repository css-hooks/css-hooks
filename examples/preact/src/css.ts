import { createHooks } from "@css-hooks/preact";

export const { styleSheet, css } = createHooks({
  hooks: {
    "&:hover": "&:hover",
    "&:active": "&:active",
    "@media (prefers-color-scheme: dark)":
      "@media (prefers-color-scheme: dark)",
  },
});
