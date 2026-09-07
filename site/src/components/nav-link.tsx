import type { ComponentProps, CSSProperties } from "react";
import * as ReactRouter from "react-router";
import { pipe } from "remeda";

import { mergeStyles, on } from "../css.ts";
import { anchorLinkStyle } from "./anchor-link.tsx";

export function NavLink({
  className,
  style,
  ...restProps
}: Omit<ComponentProps<typeof ReactRouter.NavLink>, "style"> & {
  style?: CSSProperties;
}) {
  const selectedClass = "a";
  const selected = `&.${selectedClass}`;
  return (
    <ReactRouter.NavLink
      style={pipe(
        anchorLinkStyle,
        on(selected, {
          color: "inherit",
          textDecorationColor: "transparent",
        }),
        mergeStyles(style),
      )}
      className={classNameProps =>
        `${classNameProps.isActive ? selectedClass : ""}${className ? ` ${typeof className === "string" ? className : className(classNameProps)}` : ""}`
      }
      {...restProps}
    />
  );
}
