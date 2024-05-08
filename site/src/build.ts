import fs from "node:fs/promises";
import path from "node:path";
import site from "./site.js";
import * as Pathname from "./pathname.js";

const outDir = path.join(process.cwd(), "dist");

await fs.rm(outDir, { recursive: true, force: true });

await Promise.all(
  site.map(async resource => {
    const filePath = path.join(
      outDir,
      Pathname.toRelativeFilePath(resource.pathname),
    );
    await fs.mkdir(path.dirname(filePath), {
      recursive: true,
    });
    const { content } = await resource.render();
    if (typeof content === "string" || Buffer.isBuffer(content)) {
      await fs.writeFile(filePath, content);
    }
  }),
);
