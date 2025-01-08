import type { ReactNode } from "react";

export function Preformatted({
  as: Tag = "pre",
  children,
}: {
  as?: "pre" | "div";
  children?: ReactNode;
}) {
  return (
    <Tag
      style={{
        fontFamily: "'Inconsolata Variable', monospace",
        fontSize: "1rem",
        marginBlock: 0,
      }}
    >
      {children}
    </Tag>
  );
}
