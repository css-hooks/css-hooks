import {
  _stringifyValue as stringifyValue,
  createHooks,
} from "@css-hooks/qwik";
import { recommended } from "@css-hooks/recommended";

export const { styleSheet, css } = createHooks({
  hooks: ({ any, all }) => ({
    ...recommended({
      pseudoClasses: [":empty", ":focus-visible", ":hover", ":active"],
      breakpoints: ["450px", "700px", "1100px"],
    }),

    // color schemes
    "@media (prefers-color-scheme: dark)": any(
      "[data-theme='dark'] &",
      all("[data-theme='auto'] &", "@media (prefers-color-scheme: dark)"),
    ),

    // responsive design
    "@container lg": "@container (100px <= width)",
    "@container sm": "@container (50px <= width < 100px)",

    // custom pseudo-classes
    "&:focus-visible-within": "&:has(:focus-visible)",
    "&:intent": any("&:focus", "&:hover"),

    // selectors
    ".group &.group": ".group &.group",
    ".group:hover &": ".group:hover &",
    ":checked + &": ":checked + &",
    ":intent + &": any(":focus + &", ":hover + &"),
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
  sort: {
    conditionalStyles: false,
  },
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
