import type { ReactNode } from "react";

export function ScreenReaderOnly({ children }: { children?: ReactNode }) {
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
