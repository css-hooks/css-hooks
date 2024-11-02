import fsSync from "fs";
import fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import puppeteer from "puppeteer";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { fileURLToPath } from "url";

const srcDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(srcDir, "..", "public");
const outDir = path.resolve(srcDir, "..", "dist", "public");

const docsBase = path.join(srcDir, "..", "..", "docs");
const serverURL = "http://localhost:3000";

await new Promise(resolve => {
  setTimeout(resolve, 5000);
});

const paths = [
  "/",
  "/docs/",
  ...(await glob(path.join(docsBase, "**", "*.md"))).map(x =>
    x
      .substring(docsBase.length - 5)
      .replace(/\/index\.md$/, "/")
      .replace(/\.md$/, "/"),
  ),
  "/img/1200/630/opengraph.png",
  ...[512, 192, 180, 32, 16].map(x => `/img/${x}/${x}/icon.png`),
  ...(await glob(path.join(publicDir, "**", "*"))).map(
    x => `${x.substring(publicDir.length)}`,
  ),
];

const browser = await puppeteer.launch();
const page = await browser.newPage();

function handleError(pathname: string) {
  return function (message: puppeteer.ConsoleMessage) {
    if (message.type() === "error") {
      throw new Error(
        `An error occurred while rendering ${pathname}: ${message.text()}`,
      );
    }
  };
}

for (const pathname of paths) {
  if (pathname.endsWith("/")) {
    const errorHandler = handleError(pathname);
    page.on("console", errorHandler);
    await page.goto(`${serverURL}${pathname}`, { waitUntil: "networkidle0" });
    page.off("console", errorHandler);
    await page.evaluate(() => {
      for (const script of Array.from(
        document.querySelectorAll("script[src]"),
      )) {
        script.parentNode?.removeChild(script);
      }
      for (const element of Array.from(
        document.querySelectorAll("[data-react-helmet]"),
      )) {
        element.removeAttribute("data-react-helmet");
      }
    });
    const html = await page.content();
    const dest = path.join(outDir, ...pathname.split("/"), "index.html");
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, html);
    console.log(`Successfully wrote ${dest}`);
  } else {
    const dest = path.join(outDir, ...pathname.split("/"));
    const url = `${serverURL}${pathname}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${res.status} ${res.statusText}`,
      );
    }
    if (!res.body) {
      throw new Error(`Request for ${url} failed: Empty response body`);
    }
    await fs.mkdir(path.dirname(dest), { recursive: true });
    const fileStream = fsSync.createWriteStream(dest);
    await finished(
      Readable.fromWeb(res.body as Parameters<typeof Readable.fromWeb>[0]).pipe(
        fileStream,
      ),
    );
    console.log(`Successfully wrote ${dest}`);
  }
}

process.exit(0);
