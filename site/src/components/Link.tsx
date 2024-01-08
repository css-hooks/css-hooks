import { css } from "@/css";
import {
  ComponentProps,
  ComponentType,
  CSSProperties,
  ReactElement,
  forwardRef,
} from "react";
import { O, U } from "ts-toolbelt";
import * as V from "varsace";

export type ForwardProps = {
  style?: CSSProperties;
};

export type Props = U.Strict<
  | ComponentProps<"a">
  | {
      children: (forwardProps: ForwardProps) => ReactElement;
    }
> & {
  selected?: boolean;
};

export default forwardRef<HTMLAnchorElement, O.Omit<Props, "ref">>(
  function Link({ children, selected, style, ...restProps }, ref) {
    const forwardProps: ForwardProps = {
      style: css(
        {
          textDecoration: "none",
          cursor: selected ? "default" : "pointer",
          ...(selected
            ? {
                color: V.gray65,
                "@media (prefers-color-scheme: dark)": { color: V.gray20 },
              }
            : {
                color: V.blue45,
                "&:hover": {
                  color: V.blue35,
                },
                "&:active": {
                  color: V.red35,
                },
                "@media (prefers-color-scheme: dark)": {
                  color: V.blue30,
                  "&:hover": {
                    color: V.blue20,
                  },
                  "&:active": {
                    color: V.red20,
                  },
                },
              }),
        },
        style,
      ),
    };

    return typeof children === "function" ? (
      children(forwardProps)
    ) : (
      <a {...forwardProps} {...restProps} ref={ref}>
        {children}
      </a>
    );
  },
) as ComponentType<Props>;
