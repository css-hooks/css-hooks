import { createHooks } from "@css-hooks/react";

export const { styleSheet, css } = createHooks({
  hooks: {
    "&:hover": "&:hover",
    "&:active": "&:active",
    "@media (prefers-color-scheme: dark)":
      "@media (prefers-color-scheme: dark)",
  },
});
