import type { JSXChildren } from "hastx/jsx-runtime";

export function ScreenReaderOnly({ children }: { children?: JSXChildren }) {
  return (
    <div
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        border: 0,
      }}
    >
      {children}
    </div>
  );
}
