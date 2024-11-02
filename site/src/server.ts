import express from "express";
import puppeteer from "puppeteer";
import { getHighlighter } from "shiki";
import ViteExpress from "vite-express";
import { z } from "zod";

import {
  syntaxHighlighterLanguageParser,
  syntaxHighlighterLanguages,
} from "./common.ts";

const highlighter = await getHighlighter({
  themes: ["github-dark", "github-light"],
  langs: [...syntaxHighlighterLanguages],
});

const app = express();
const port = 3000;
const baseUrl = `http://localhost:${port}/`;

app.post("/highlight", express.json(), async (req, res) => {
  const maybeParams = z
    .object({ lang: syntaxHighlighterLanguageParser, code: z.string() })
    .safeParse(req.body);
  if (maybeParams.error) {
    res.status(400).send(maybeParams.error.message);
    return;
  }
  const { code, lang } = maybeParams.data;
  res.status(200).send(
    await highlighter.codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      transformers: [
        {
          pre(el) {
            el.tagName = "div";
            for (const child of el.children) {
              if (child.type === "element" && child.tagName === "code") {
                el.children = child.children;
                break;
              }
            }
          },
          line(line) {
            if (line.children[0]?.type === "element") {
              const node = line.children[0].children[0];
              if (node?.type === "text") {
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
    }),
  );
});

app.get("/img/:width/:height/*?.:ext", async (req, res) => {
  const maybeParams = z
    .object({
      "0": z.string(),
      width: z.string().regex(/^[0-9]+$/),
      height: z.string().regex(/^[0-9]+$/),
      ext: z.enum(["png", "jpeg", "webp"]),
    })
    .transform(properties => ({
      width: parseInt(properties.width),
      height: parseInt(properties.height),
      path: properties[0],
      ext: properties.ext,
    }))
    .safeParse(req.params);
  if (maybeParams.error) {
    res.status(400).send(maybeParams.error.message);
    return;
  }
  const { width, height, path, ext } = maybeParams.data;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle2" });
  const screenshot = await page.screenshot({ type: ext, omitBackground: true });
  await browser.close();
  res
    .status(200)
    .setHeader("Content-Type", `image/${ext}`)
    .send(Buffer.from(screenshot));
});

ViteExpress.listen(app, port);
