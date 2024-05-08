import { JSXChildren } from "hastx/jsx-runtime";
import { css } from "../css.js";

export function Block({ children }: { children?: JSXChildren }) {
  return (
    <div
      style={css({
        width: "calc(100vw - 4rem)",
        maxWidth: "80rem",
        margin: "0 auto",
      })}
    >
      {children}
    </div>
  );
}
