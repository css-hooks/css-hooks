import { CSSProperties, cssValueToString } from "hastx/css";
import { buildHooksSystem } from "@css-hooks/core";
import { recommended } from "@css-hooks/recommended";
import globalStyles from "./global.css";

const createHooks = buildHooksSystem<CSSProperties>(cssValueToString);

const { styleSheet: hookStyles, css } = createHooks({
  hooks: ({ and, or }) => ({
    ...recommended({
      pseudoClasses: [":empty", ":focus-visible", ":active", ":has(*)"],
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
    ".prose &": ".prose &",
    ".section &": ".section &",
    "&.selected": "&.selected",
    ":has(:checked) + &": ":has(:checked) + &",
    ".shiki > &": ".shiki > &",

    // feature queries
    "@supports (height: 100dvh)": "@supports (height: 100dvh)",
  }),
  debug: false, //process.env.NODE_ENV !== "production",
});

export const styleSheet = () =>
  [globalStyles, hookStyles()].join(
    process.env.NODE_ENV === "production" ? "" : "\n\n",
  );

export { css };
