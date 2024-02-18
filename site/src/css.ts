import {
  _stringifyValue as stringifyValue,
  createHooks,
} from "@css-hooks/qwik";
import { recommended } from "@css-hooks/recommended";

export const { styleSheet, css } = createHooks({
  hooks: ({ and, or }) => ({
    ...recommended({
      pseudoClasses: [":empty", ":focus-visible", ":hover", ":active"],
      breakpoints: ["450px", "700px", "1100px"],
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
    "&:intent": or("&:focus", "&:hover"),

    // selectors
    ".group &.group": ".group &.group",
    ".group:hover &": ".group:hover &",
    ":checked + &": ":checked + &",
    ":intent + &": or(":focus + &", ":hover + &"),
    "&.primary": "&.primary",
    ".blue &": ".blue &",
    ".pink &": ".pink &",
    ".yellow &": ".yellow &",
    ".green &": ".green &",
    ".teal &": ".teal &",
    ".purple &": ".purple &",
    ".section &.section": ".section &.section",
    ".section .section &": ".section .section &",
    "&.selected": "&.selected",
    ":has(:checked) + &": ":has(:checked) + &",

    // feature queries
    "@supports (height: 100dvh)": "@supports (height: 100dvh)",
  }),
  debug: import.meta.env.DEV,
});

export function renderToString(obj: Parameters<typeof css>[0]) {
  return Object.entries(css(obj))
    .map(
      ([k, v]) =>
        `${k.replace(/[A-Z]/g, x => `-${x.toLowerCase()}`)}:${stringifyValue(
          k,
          v,
        )}`,
    )
    .join(";");
}
