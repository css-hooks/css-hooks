import type { ComponentProps } from "react";
import * as ReactRouter from "react-router";
import { pipe } from "remeda";

import { merge, on } from "../css.ts";
import { anchorLinkStyle } from "./anchor-link.tsx";

export function NavLink({
  className,
  style,
  ...restProps
}: ComponentProps<typeof ReactRouter.NavLink>) {
  const selectedClass = "a";
  const selected = `&.${selectedClass}`;
  return (
    <ReactRouter.NavLink
      style={props =>
        pipe(
          anchorLinkStyle,
          on(selected, {
            color: "inherit",
            textDecorationColor: "transparent",
          }),
          merge(typeof style === "function" ? style(props) : style),
        )
      }
      className={classNameProps =>
        `${classNameProps.isActive ? selectedClass : ""}${className ? ` ${typeof className === "string" ? className : className(classNameProps)}` : ""}`
      }
      {...restProps}
    />
  );
}
