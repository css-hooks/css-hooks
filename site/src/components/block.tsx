import type { ReactNode } from "react";

export function Block({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        containerType: "inline-size",
        width: "calc(100vw - 64px)",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}
