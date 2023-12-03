import { css } from "@/css-hooks";
import { CSSProperties, ReactNode } from "react";
import { gray10, gray80 } from "varsace";

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
        background: gray10,
        overflow: "auto",
        dark: {
          background: gray80,
        },
        ...style,
      })}
      {...restProps}
    />
  );
}
