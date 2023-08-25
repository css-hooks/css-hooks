import {
  CSSProperties,
  ComponentProps,
  ComponentType,
  ReactElement,
  ReactNode,
  forwardRef,
} from "react";
import { O, U } from "ts-toolbelt";
import Typography from "./Typography";
import hooks from "@hooks.css/react";

function Radio({ checked }: { checked?: boolean }) {
  return (
    <svg width="18px" height="18px" viewBox="0 0 24 24">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
        fill="currentColor"
      />
      {checked && <circle cx="12" cy="12" r="5" fill="currentColor" />}
    </svg>
  );
}

export type ForwardProps = {
  renderChildren?: (children: ReactNode) => ReactElement;
  style?: CSSProperties;
};

export type Props = U.Strict<
  | ComponentProps<"a">
  | {
      children: (forwardProps: ForwardProps) => ReactElement;
    }
> & {
  checked?: boolean;
};

export default forwardRef<HTMLAnchorElement, O.Omit<Props, "ref">>(
  function RadioLink({ checked, children, style, ...restProps }, ref) {
    const renderChildren: Exclude<
      ForwardProps["renderChildren"],
      undefined
    > = children => (
      <Typography
        variant="regularBase"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25em",
        }}
      >
        <Radio checked={checked} />
        <span>{children}</span>
      </Typography>
    );

    const forwardStyle: CSSProperties = hooks({
      color: checked ? "var(--blue-300)" : "var(--blue-400)",
      textDecoration: "none",
      hover: {
        color: "var(--blue-300)",
      },
      ...style,
    });

    if (typeof children === "function") {
      return children({
        renderChildren,
        style: forwardStyle,
      });
    }

    return (
      <a style={forwardStyle} {...restProps} ref={ref}>
        {renderChildren(children)}
      </a>
    );
  },
) as ComponentType<Props>;
