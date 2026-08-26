import { pipe } from "remeda";

import { createHooks } from "./index.ts";

{
  const { on } = createHooks("&");
  pipe(
    {
      // @ts-expect-error generated kebab-case shorthand/longhand conflict
      margin: "0px",
    },
    on("&", { "margin-top": "1px" }),
  );
}
