import { CSSProperties, ComponentProps, ReactElement, forwardRef } from "react";
import { Inconsolata, Inter } from "next/font/google";
import { O, U } from "ts-toolbelt";

export type ForwardProps = {
  className?: string;
  style?: CSSProperties;
};

const inter = Inter({ subsets: ["latin"] });
const inconsolata = Inconsolata({ subsets: ["latin"], weight: ["400"] });

function makeStyle(fontSizeRem: number, fontWeight: 400 | 700 = 400) {
  const marginBlock = `${1.5 / fontSizeRem}rem`;
  return {
    fontSize: `${fontSizeRem}rem`,
    fontWeight,
    lineHeight: 1.25,
    marginBlock,
  };
}

const variantStyles = {
  regularBase: makeStyle(1, 400),
  boldBase: makeStyle(1, 700),
  boldLarge: makeStyle(1.2, 700),
  regularXL: makeStyle(1.601),
  regular2XL: makeStyle(2),
  bold2XL: makeStyle(2, 700),
  regular3XL: makeStyle(2.4),
  bold3XL: makeStyle(2.4, 700),
  regular4XL: makeStyle(3),
} as const;

export type Props = {
  margins?: boolean;
  variant?: keyof typeof variantStyles | "codeBase";
} & U.Strict<
  | ComponentProps<"span">
  | {
      children?: (forwardProps: ForwardProps) => ReactElement;
    }
>;

export default forwardRef<HTMLSpanElement, O.Omit<Props, "ref">>(
  function Typography(
    {
      children,
      className = "",
      margins,
      style,
      variant = "regularBase",
      ...restProps
    },
    ref,
  ) {
    const forwardProps: ForwardProps = {
      className: `${className} ${
        variant === "codeBase" ? inconsolata.className : inter.className
      }`,
      style: {
        ...variantStyles[variant === "codeBase" ? "regularBase" : variant],
        letterSpacing: variant === "codeBase" ? undefined : "-0.03em",
        ...(margins ? { display: "block" } : { margin: 0 }),
        ...style,
      },
    };
    return typeof children === "function" ? (
      children(forwardProps)
    ) : (
      <span {...forwardProps} {...restProps} ref={ref}>
        {children}
      </span>
    );
  },
);
