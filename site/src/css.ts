import { buildHooksSystem } from "@css-hooks/core";
import type { CSSProperties } from "hastx/css";
import { cssValueToString } from "hastx/css";

import globalStyles from "./global.css";

const createHooks = buildHooksSystem<CSSProperties>((a, b) =>
  cssValueToString(b, a),
);

const {
  styleSheet: hookStyles,
  on,
  and,
  or,
  not,
} = createHooks(
  "@supports (height: 100dvh)",

  "@media (width < 28em)",
  "@media (width < 44em)",
  "@media (width < 69em)",
  "@media (width >= 28em)",
  "@media (width >= 44em)",
  "@media (width >= 69em)",
  "@media (prefers-color-scheme: dark)",
  "@media (hover: hover)",

  "[data-theme='auto'] &",
  "[data-theme='dark'] &",

  "@container (width < 50px)",
  "@container (width < 100px)",
  "@container (width >= 100px)",

  "&:active",
  "&:empty",
  "&:focus-visible",
  "&:has(*)",
  "&:has(:focus-visible)",
  "&:focus",
  "&:hover",
  "&:only-child",

  ".group &.group",
  ".group:hover &",
  ".group:nth-child(even) &",
  ":checked + &",
  ":focus + &",
  ":hover + &",
  "&.primary",
  ".blue &",
  ".pink &",
  ".yellow &",
  ".green &",
  ".teal &",
  ".purple &",
  ".prose &",
  ".section &",
  "&.selected",
  ":has(:checked) + &",
  ".shiki > &",
);

export const styleSheet = () =>
  [globalStyles, hookStyles()].join(
    process.env["NODE_ENV"] === "production" ? "" : "\n\n",
  );

export { on, and, or, not };

export const dark = or(
  "[data-theme='dark'] &",
  and("[data-theme='auto'] &", "@media (prefers-color-scheme: dark)"),
);

export const hover = and("&:hover", "@media (hover: hover)");

export const intent = or(hover, "&:focus");

export const intentAdjacentSibling = or(
  and(":hover + &", "@media (hover: hover)"),
  ":focus + &",
);
