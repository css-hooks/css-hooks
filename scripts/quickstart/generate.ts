import { readdir, readFile, writeFile } from "node:fs/promises";

import { readQuickstart } from "@test/quickstart/fixture";
import { format, resolveConfig } from "prettier";

import { renderBlocks, replaceBlocks } from "./render.ts";

const guides = new URL("../../docs/quickstart/", import.meta.url);

for (const entry of await readdir(guides, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  const framework = entry.name === "vanilla" ? "core" : entry.name;
  const directory = new URL(
    `../../packages/${framework}/test/quickstart/`,
    import.meta.url,
  );
  const guide = new URL(`${entry.name}/index.md`, guides);
  const quickstart = await readQuickstart(directory);
  const blocks = await renderBlocks(directory, quickstart);
  const markdown = replaceBlocks(await readFile(guide, "utf8"), blocks);
  await writeFile(
    guide,
    await format(markdown, {
      ...(await resolveConfig(guide)),
      parser: "markdown",
    }),
  );
}
