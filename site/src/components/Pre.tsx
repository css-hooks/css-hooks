import { css } from "@/css";
import { CSSProperties, ReactNode } from "react";
import * as V from "varsace";

export default function Pre({
  style,
  ...restProps
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <pre
      style={css({
        marginBlock: "1.5em",
        lineHeight: 1.25,
        padding: "1.5em",
        background: V.white,
        boxShadow: `0 0 0 1px ${V.gray20}`,
        overflow: "auto",
        "@media (prefers-color-scheme: dark)": {
          background: V.gray85,
          boxShadow: "none",
        },
        ...style,
      })}
      {...restProps}
    />
  );
}
