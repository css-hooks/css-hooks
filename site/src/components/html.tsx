import type { JSXChildren } from "hastx/jsx-runtime";

export function Html({ children }: { children?: JSXChildren }) {
  return <html lang="en">{children}</html>;
}
