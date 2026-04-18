import type { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { cloneElement } from "react";
import { pipe } from "remeda";

import { merge } from "../css.ts";

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
    style: pipe(style || {}, merge(children.props.style)),
  });
}
