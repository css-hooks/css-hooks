import type { CSSProperties } from "react";

import { purple } from "../design/colors.ts";

export function Logomark({ height = "1em" }: Pick<CSSProperties, "height">) {
  return (
    <div
      style={{
        height,
        aspectRatio: 1,
        display: "grid",
        gridTemplateRows: "repeat(5, 1fr)",
        gridTemplateColumns: "3fr 4fr 3fr 4fr 3fr",
        color: purple(61),
        borderRadius: "0 12.5% 12.5%",
        overflow: "hidden",
      }}
    >
      {[
        { row: [1, 6], column: 1 },
        { row: 1, column: [2, 4] },
        { row: 2, column: 3 },
        { row: 4, column: 3 },
        { row: 5, column: [3, 5] },
        { row: [1, 6], column: 5 },
      ].map(({ row, column }) => (
        <div
          key={JSON.stringify({ row, column })}
          style={{
            background: "currentColor",
            gridRow: typeof row === "number" ? row : row.join(" / "),
            gridColumn:
              typeof column === "number" ? column : column.join(" / "),
          }}
        />
      ))}
    </div>
  );
}
