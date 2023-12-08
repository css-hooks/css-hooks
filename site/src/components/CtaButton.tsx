import { O, U } from "ts-toolbelt";
import Typography from "./Typography";
import { CSSProperties, ComponentProps, ReactElement, forwardRef } from "react";
import { exhausted } from "@/util/exhausted";
import { css } from "@/css-hooks";
import {
  blue40,
  blue50,
  gray50,
  gray70,
  purple50,
  purple60,
  red40,
  red50,
  white,
} from "varsace";

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
              background: theme === "purple" ? purple50 : gray50,
              color: white,
              padding: "0.5em 0.75em",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5em",
              ":hover": {
                background: blue40,
              },
              ":active": {
                background: red40,
              },
              "@media (prefers-color-scheme: dark)": {
                background: theme === "purple" ? purple60 : gray70,
                ":hover": {
                  background: blue50,
                },
                ":active": {
                  background: red50,
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
