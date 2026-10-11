import fs from "node:fs";
import path from "node:path";

import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vite";

const rawMdxPrefix = "\0mdx-raw:";

export default defineConfig({
  plugins: [
    {
      name: "raw-mdx",
      enforce: "pre",
      resolveId(source, importer) {
        if (!importer || !source.endsWith(".mdx?raw")) return;
        const file = path.resolve(path.dirname(importer), source.slice(0, -4));
        return rawMdxPrefix + Buffer.from(file).toString("base64");
      },
      load(id) {
        if (!id.startsWith(rawMdxPrefix)) return;
        const file = Buffer.from(
          id.slice(rawMdxPrefix.length),
          "base64",
        ).toString();
        return `export default ${JSON.stringify(fs.readFileSync(file, "utf8"))};`;
      },
    },
    mdx({ include: /\.mdx$/, remarkPlugins: [remarkFrontmatter] }),
    reactRouter(),
  ],
});
