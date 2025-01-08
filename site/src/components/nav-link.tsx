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
  return (
    <ReactRouter.NavLink
      style={props =>
        pipe(
          anchorLinkStyle,
          on("&.selected", {
            color: "inherit",
          }),
          merge(typeof style === "function" ? style(props) : style),
        )
      }
      className={classNameProps =>
        `${classNameProps.isActive ? "selected" : ""}${className ? ` ${typeof className === "string" ? className : className(classNameProps)}` : ""}`
      }
      {...restProps}
    />
  );
}
