import fm from "front-matter";
import * as v from "valibot";

export const docs = Object.entries(
  import.meta.glob("../../../docs/**/*.md", { eager: true, query: "raw" }),
)
  .filter(
    (x): x is [string, { default: string }] =>
      x.length === 2 &&
      typeof x[0] === "string" &&
      !!x[1] &&
      typeof x[1] === "object" &&
      "default" in x[1] &&
      typeof x[1].default === "string",
  )
  .map(([key, { default: value }]) => {
    const pathname = `/docs${key
      .substring("../../../docs".length)
      .replace(/\/index\.md$/, "")
      .replace(/\.md$/, "")}/`;

    const level =
      key
        .replace(/^.*\/docs\//, "")
        .split("")
        .filter(x => x === "/").length - 1;

    const index = /\/index\.md$/.test(key);

    if (/\/api\//.test(key)) {
      return {
        attributes: {
          index,
          pathname,
          editURL: undefined,
          level,
          title: "API",
          description: "Detailed API reference",
          order: key.endsWith("index.md") ? 99 : -1,
        },
        body: value,
      };
    }

    const doc = v.parse(
      v.object({
        attributes: v.object({
          title: v.string(),
          description: v.string(),
          order: v.number(),
        }),
        body: v.string(),
      }),
      fm(value),
    );

    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        index,
        pathname,
        level,
        editURL: `https://github.com/css-hooks/css-hooks/edit/master/docs${key.substring("../../docs".length)}`,
      },
    };
  });
