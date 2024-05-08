import { glob } from "glob";
import fs from "node:fs/promises";
import path from "node:path";
import routes from "./routes/index.js";
import { fileURLToPath } from "node:url";
import { Route } from "./route.js";
import { isElement } from "hast-util-is-element";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeShiki from "@shikijs/rehype";
import { rehypeRewriteElement, rehypeStyle } from "./rehype.js";
import rehypeStringify from "rehype-stringify";
import { toHtml } from "hast-util-to-html";
import * as MimeType from "./mime-type.js";
import { css } from "./css.js";
import { z } from "zod";
import puppeteer from "puppeteer";
import * as V from "varsace";
import { styleObjectToString } from "hastx/css";
import * as Pathname from "./pathname.js";

const staticDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "static",
);

const statics = (await glob(path.join(staticDir, "**", "*"))).map(filePath => ({
  pathname: filePath.substring(staticDir.length),
  async render() {
    const content = await fs.readFile(filePath);
    return { content };
  },
}));

const site: Route[] = [...statics, ...(await routes())].map(
  ({ pathname, render }): Route => ({
    pathname,
    async render() {
      const mimeType = MimeType.fromPath(Pathname.toRelativeFilePath(pathname));
      const rendered = await render();
      const content = await processContent(rendered.content);
      const imageSpec = z
        .object({
          metadata: z.object({
            width: z.number(),
            height: z.number(),
          }),
          content: z.string(),
          type: z
            .string()
            .regex(/^image\/(jpeg|png|webp)/)
            .transform(s => s.substring(6) as "jpeg" | "png" | "webp"),
        })
        .safeParse({ ...rendered, content, type: mimeType });
      if (imageSpec.success) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setViewport(imageSpec.data.metadata);
        await page.setContent(imageSpec.data.content, {
          waitUntil: "networkidle0",
        });
        const screenshot = await page.screenshot({
          type: imageSpec.data.type,
          omitBackground: true,
        });
        await browser.close();
        return { content: screenshot };
      }
      return { content };
    },
  }),
);

async function processContent(content: string | Buffer | JSX.Element) {
  if (isElement(content)) {
    return (
      await unified()
        .use(rehypeParse)
        .use(rehypeShiki, {
          themes: {
            dark: "github-dark",
            light: "github-light",
          },
          defaultColor: false,
          transformers: [
            {
              line(line) {
                if (line.children[0]?.type === "element") {
                  const node = line.children[0].children[0];
                  if (node.type === "text") {
                    const diffType =
                      node.value[0] === "+"
                        ? "add"
                        : node.value[0] === "-"
                          ? "remove"
                          : undefined;
                    if (diffType) {
                      line.properties["class"] += ` diff ${diffType}`;
                      node.value = node.value.substring(1);
                    }
                  }
                }
              },
            },
          ],
        })
        .use(rehypeStyle, {
          code: css({
            fontFamily: "inherit",
            color: "inherit",
            on: ($, { and, not }) => [
              $(not(".shiki > &"), {
                fontFamily: "'Inconsolata', monospace",
                color: V.teal60,
              }),
              $(and("@media (prefers-color-scheme: dark)", not(".shiki > &")), {
                color: V.teal30,
              }),
            ],
          }),
        })
        .use(rehypeRewriteElement, {
          pre(node) {
            if (
              typeof node.properties.class === "string" &&
              node.properties.class.includes("shiki")
            ) {
              node.properties.style = `${node.properties.style};${styleObjectToString(
                css({
                  fontFamily: "'Inconsolata', monospace",
                  fontSize: "1rem",
                  overflow: "auto",
                  padding: "1rem",
                  margin: 0,
                  background: V.white,
                  on: ($, { not }) => [
                    $(".prose &", {
                      marginBlock: "1.5rem",
                    }),
                    $(not("@media (prefers-color-scheme: dark)"), {
                      boxShadow: `inset 0 0 0 1px ${V.gray20}`,
                    }),
                    $("@media (prefers-color-scheme: dark)", {
                      background: V.gray85,
                    }),
                  ],
                }),
              )}`;
            }
          },
        })
        .use(rehypeStringify)
        .process(
          toHtml({ type: "root", children: [{ type: "doctype" }, content] }),
        )
    ).value.toString();
  }
  return content;
}

export default site;
