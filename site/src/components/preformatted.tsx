import type { ReactNode } from "react";

import { monospace } from "../design/typography.ts";

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
        fontFamily: monospace,
        fontSize: "inherit",
        marginBlock: 0,
      }}
    >
      {children}
    </Tag>
  );
}
