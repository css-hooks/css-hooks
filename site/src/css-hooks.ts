import { createHooks, recommended } from "@css-hooks/react";

const [css, hooks] = createHooks({
  ...recommended,
  previousHover: ":hover + &",
  previousActive: ":active + &",

  dark: "@media (prefers-color-scheme: dark)",
  mobile: "@media (max-width: 499px)",
  desktop: "@media (min-width: 500px)",
});

export default hooks;
export { css };
