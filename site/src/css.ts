import {
  _stringifyValue as stringifyValue,
  createHooks,
} from "@css-hooks/qwik";
import { recommended } from "@css-hooks/recommended";

export const { styleSheet, css } = createHooks({
  hooks: ({ and, or }) => ({
    ...recommended({
      pseudoClasses: [":empty", ":focus-visible", ":active"],
      breakpoints: ["28em", "44em", "69em"],
    }),

    // color schemes
    "@media (prefers-color-scheme: dark)": or(
      "[data-theme='dark'] &",
      and("[data-theme='auto'] &", "@media (prefers-color-scheme: dark)"),
    ),

    // responsive design
    "@container lg": "@container (100px <= width)",
    "@container sm": "@container (50px <= width < 100px)",

    // custom pseudo-classes
    "&:focus-visible-within": "&:has(:focus-visible)",
    "&:intent": or("&:focus", and("&:hover", "@media (hover: hover)")),
    "&:hover": and("&:hover", "@media (hover: hover)"),

    // selectors
    "&:only-child": "&:only-child",
    ".group &.group": ".group &.group",
    ".group:hover &": and(".group:hover &", "@media (hover: hover)"),
    ".group:even-child &": ".group:nth-child(even) &",
    ":checked + &": ":checked + &",
    ":intent + &": or(":focus + &", and(":hover + &", "@media (hover: hover)")),
    "&.primary": "&.primary",
    ".blue &": ".blue &",
    ".pink &": ".pink &",
    ".yellow &": ".yellow &",
    ".green &": ".green &",
    ".teal &": ".teal &",
    ".purple &": ".purple &",
    ".section &": ".section &",
    "&.selected": "&.selected",
    ":has(:checked) + &": ":has(:checked) + &",
    ".shiki > &": ".shiki > &",

    // feature queries
    "@supports (height: 100dvh)": "@supports (height: 100dvh)",
  }),
  debug: import.meta.env.DEV,
});

export function renderToString(obj: Parameters<typeof css>[0]) {
  return Object.entries(css(obj))
    .map(
      ([k, v]) =>
        `${/^--/.test(k) ? k : k.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`)}:${stringifyValue(
          k,
          v,
        )}`,
    )
    .join(";");
}
