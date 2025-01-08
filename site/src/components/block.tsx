import type { ReactNode } from "react";

export function Block({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        width: "calc(100vw - 4rem)",
        maxWidth: "80rem",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}
