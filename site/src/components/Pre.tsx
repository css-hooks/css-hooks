import hooks from "@/css-hooks";
import { CSSProperties, ReactNode } from "react";

export default function Pre({
  style,
  ...restProps
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <pre
      style={hooks({
        marginBlock: "1.5em",
        lineHeight: 1.25,
        padding: "1.5em",
        background: "var(--gray-100)",
        dark: {
          background: "transparent",
          boxShadow: "inset 0 0 0 1px var(--gray-900)",
        },
        ...style,
      })}
      {...restProps}
    />
  );
}
