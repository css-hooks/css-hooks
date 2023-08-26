import hooks from "@hooks.css/react";
import { ComponentProps, CSSProperties, ReactElement, forwardRef } from "react";
import { O, U } from "ts-toolbelt";

export type ForwardProps = {
  style?: CSSProperties;
};

export type Props = U.Strict<
  | ComponentProps<"a">
  | {
      children: (forwardProps: ForwardProps) => ReactElement;
    }
>;

export default forwardRef<HTMLAnchorElement, O.Omit<Props, "ref">>(
  function Link({ children, style, ...restProps }, ref) {
    const forwardProps: ForwardProps = {
      style: hooks({
        color: "var(--blue-800)",
        textDecoration: "none",
        hover: {
          color: "var(--blue-700)",
        },
        active: {
          color: "var(--red-700)",
        },
        dark: {
          color: "var(--blue-400)",
          hover: {
            color: "var(--blue-300)",
          },
          active: {
            color: "var(--red-400)",
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
  },
);
