import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { fileURLToPath } from "url";

import config from "./react-router.config.ts";

async function waitForServer(url: string, retries: number = 15) {
  try {
    await fetch(url);
  } catch {
    if (retries) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await waitForServer(url, retries - 1);
    }
    throw new Error(`No response from ${url} and retries exhausted`);
  }
}

await waitForServer("http://localhost:5173");

await Promise.all(
  (await config.prerender({ getStaticPaths: () => ["/opengraph.png"] }))
    .filter(s => /\.(gif|jpeg|jpg|png|webp)$/.test(s))
    .map(route => {
      const url = URL.parse(route, "http://localhost:5173")?.toString();
      return url ? { route, url } : undefined;
    })
    .filter(Boolean)
    .map(async ({ route, url }) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Request for ${route} failed with an unexpected ${response.status} (${response.statusText}) response.`,
        );
      }
      if (!response.body) {
        throw new Error(`No response body for ${route}`);
      }
      const responseStream = Readable.fromWeb(response.body);
      const filePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "build",
        "client",
        ...route.split("/"),
      );
      const fileStream = fs.createWriteStream(filePath);
      await new Promise((resolve, reject) => {
        const stream = responseStream.pipe(fileStream);
        stream.on("finish", resolve);
        stream.on("error", reject);
      });
      return console.log(`Rerendered ${route}`);
    }),
);
