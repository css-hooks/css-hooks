import type { ReactNode } from "react";

export function Preformatted({
  as: Tag = "pre",
  dangerouslySetInnerHTML,
  children,
}: {
  as?: "pre" | "div";
  dangerouslySetInnerHTML?: { __html: string };
  children?: ReactNode;
}) {
  return (
    <Tag
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
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
