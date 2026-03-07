import type { CSSProperties, ReactElement } from "react";
import { pipe } from "remeda";

import { dark, intent, on, or } from "../css.ts";
import { gray, purple, white } from "../design/colors.ts";
import { Slot } from "./slot.tsx";

export function HeaderUtility(props: {
  asChild: true;
  children: ReactElement<{ style?: CSSProperties }>;
}) {
  return (
    <Slot
      {...props}
      style={pipe(
        {
          fontSize: "0.75em",
          position: "relative",
          display: "inline-flex",
          color: gray(40),
          outlineWidth: 0,
          outlineStyle: "solid",
          outlineColor: purple(20),
          outlineOffset: 2,
        },
        on(intent, {
          color: gray(60),
        }),
        on("&:active", {
          color: gray(70),
        }),
        on(
          dark,
          pipe(
            {
              color: gray(60),
              outlineColor: purple(50),
            },
            on(intent, {
              color: gray(15),
            }),
            on("&:active", {
              color: white,
            }),
          ),
        ),
        on(or("&:focus-visible", "&:has(:focus-visible)"), {
          outlineWidth: 2,
        }),
      )}
    />
  );
}
