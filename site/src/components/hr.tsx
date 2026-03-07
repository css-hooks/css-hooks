import { pipe } from "remeda";

import { dark, on, withAlpha } from "../css.ts";
import { gray } from "../design/colors.ts";

export function Hr() {
  return (
    <hr
      style={pipe(
        {
          margin: 0,
          borderWidth: 0,
          borderTopWidth: 1,
          borderStyle: "solid",
          borderColor: gray(19),
        },
        on(dark, {
          borderColor: withAlpha(gray(55), 0.2),
        }),
      )}
    />
  );
}
