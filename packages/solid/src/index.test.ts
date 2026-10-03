import { createHooks, mergeStyles } from "./index.ts";

{
  const { on } = createHooks("&");
  mergeStyles(
    { margin: "0px" },
    // @ts-expect-error generated kebab-case shorthand/longhand conflict
    on("&", { "margin-top": "1px" }),
  );
}
