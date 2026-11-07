import { readFile } from "node:fs/promises";

import * as v from "valibot";

const quickstartSchema = v.pipe(
  v.string(),
  v.parseJson(),
  v.object({
    create: v.string(),
    install: v.string(),
    steps: v.array(
      v.union([
        v.object({ source: v.string(), target: v.string() }),
        v.object({ patch: v.string() }),
      ]),
    ),
  }),
);

export type Quickstart = v.InferOutput<typeof quickstartSchema>;

export async function readQuickstart(directory: URL) {
  return v.parse(
    quickstartSchema,
    await readFile(new URL("steps.json", directory), "utf8"),
  );
}
