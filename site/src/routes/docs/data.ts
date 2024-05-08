import { glob } from "glob";
import path from "node:path";
import { z } from "zod";

const docsBase = path.resolve(
  import.meta.dirname,
  ..."../../../../docs".split("/"),
);

export const getArticles = async () =>
  await Promise.all(
    (await glob(path.join(docsBase, "**", "*.md"))).map(async filePath => {
      const pathname = `/docs${filePath
        .substring(docsBase.length)
        .replace(/\/index\.md$/, "")
        .replace(/\.md$/, "")}/`;
      const level =
        pathname
          .replace(/^\/docs\//, "")
          .split("")
          .filter(x => x === "/").length - 1;
      if (/[\\\/]api[\\\/]/.test(filePath)) {
        return {
          filePath,
          editURL: undefined,
          pathname,
          level,
          title: "API",
          description: "Comprehensive API reference",
          order: filePath.endsWith("index.md") ? 99 : -1,
          content: z
            .object({ default: z.object({ content: z.string() }) })
            .transform(({ default: { content } }) => content)
            .parse(await import(filePath)),
        };
      }
      return {
        filePath,
        editURL: `https://github.com/css-hooks/css-hooks/edit/master/docs${filePath.substring(docsBase.length)}`,
        pathname,
        level,
        ...z
          .object({
            default: z.object({
              data: z.object({
                title: z.string(),
                description: z.string(),
                order: z.number(),
              }),
              content: z.string(),
            }),
          })
          .transform(({ default: { data, content } }) => ({ ...data, content }))
          .parse(await import(filePath)),
      };
    }),
  );
