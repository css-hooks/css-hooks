import type { JSXChildren } from "hastx/jsx-runtime";

export function Block({ children }: { children?: JSXChildren }) {
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
