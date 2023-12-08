import { createHooks } from "@css-hooks/react";
import { recommended } from "@css-hooks/recommended";

export const [hooks, css] = createHooks({
  ...recommended({
    breakpoints: ["500px"],
    colorSchemes: ["dark"],
    pseudoClasses: [":hover", ":active"],
  }),
  ":hover + &": ":hover + &",
  ":active + &": ":active + &",
});
