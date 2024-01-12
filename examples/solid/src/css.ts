import { createHooks } from "@css-hooks/solid";

export const [hooks, css] = createHooks(
  {
    "&:hover": "&:hover",
    "&:active": "&:active",
    "@media (prefers-color-scheme: dark)":
      "@media (prefers-color-scheme: dark)",
  },
  {
    sort: true,
  },
);
