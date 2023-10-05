import hooks from "@/css-hooks";
import {
  ComponentProps,
  ComponentType,
  CSSProperties,
  ReactElement,
  forwardRef,
} from "react";
import { O, U } from "ts-toolbelt";
import { blue20, blue30, blue40, blue50, red20, red40 } from "varsace";

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
      style: hooks({
        color: selected ? "inherit" : blue50,
        textDecoration: "none",
        cursor: selected ? "default" : "pointer",
        ...(!selected && {
          hover: {
            color: blue40,
          },
          active: {
            color: red40,
          },
          dark: {
            color: blue30,
            hover: {
              color: blue20,
            },
            active: {
              color: red20,
            },
          },
        }),
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
  },
) as ComponentType<Props>;
