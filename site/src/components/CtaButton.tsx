import { O, U } from "ts-toolbelt";
import Typography from "./Typography";
import { CSSProperties, ComponentProps, ReactElement, forwardRef } from "react";
import { exhausted } from "@/util/exhausted";
import { css } from "@/css";
import * as V from "varsace";

export type ForwardProps = {
  className?: string;
  style?: CSSProperties;
};

export type Props = U.Strict<
  | ComponentProps<"a">
  | { children: (forwardProps: ForwardProps) => ReactElement }
> & {
  theme?: "purple" | "gray";
};

export default forwardRef<HTMLAnchorElement, O.Omit<Props, "ref">>(
  function CtaButton(
    { children, className = "", theme = "gray", style, ...restProps },
    ref,
  ) {
    return (
      <Typography variant="boldLarge">
        {({
          className: typographyClassName = "",
          style: typographyStyle,
          ...typographyRest
        }) => {
          exhausted(typographyRest);

          const forwardProps: ForwardProps = {
            className: `${className} ${typographyClassName}`,
            style: css({
              ...typographyStyle,
              textDecoration: "none",
              background: theme === "purple" ? V.purple45 : V.gray45,
              color: V.white,
              padding: "0.5em 0.75em",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
              "&:hover": {
                background: V.blue35,
              },
              "&:active": {
                background: V.red35,
              },
              "@media (prefers-color-scheme: dark)": {
                background: theme === "purple" ? V.purple60 : V.gray70,
                "&:hover": {
                  background: V.blue50,
                },
                "&:active": {
                  background: V.red50,
                },
              },
              ...style,
            }),
          };

          return typeof children === "function" ? (
            children(forwardProps)
          ) : (
            <a {...forwardProps} {...restProps} ref={ref}>
              {children}
            </a>
          );
        }}
      </Typography>
    );
  },
);
