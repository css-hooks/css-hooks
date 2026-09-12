import type { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { cloneElement } from "react";
import { pipe } from "remeda";

import { mergeStyles } from "../css.ts";

export function Slot({
  children,
  style,
  ...props
}: {
  children: ReactElement<{ style?: CSSProperties }>;
} & HTMLAttributes<HTMLElement>) {
  const forwardProps = { ...props };
  if ("asChild" in forwardProps) delete forwardProps["asChild"];

  return cloneElement(children, {
    ...forwardProps,
    ...children.props,
    style: pipe(style || {}, mergeStyles(children.props.style)),
  });
}
