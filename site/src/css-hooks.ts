import { createHooks, recommended } from "@css-hooks/react";

export const [hooks, css] = createHooks({
  ...recommended,
  previousHover: ":hover + &",
  previousActive: ":active + &",

  dark: "@media (prefers-color-scheme: dark)",
  mobile: "@media (max-width: 499px)",
  desktop: "@media (min-width: 500px)",
});
