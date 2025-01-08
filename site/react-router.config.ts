import type { Config } from "@react-router/dev/config";

import { docs } from "./src/data/docs.ts";

export default {
  ssr: true,
  appDirectory: "src",
  prerender: async ({ getStaticPaths }) => [
    ...getStaticPaths(),
    ...[32, 128, 180, 192, 512].map(x => `/icons/${x}/${x}/icon.png`),
    ...docs.map(doc => doc.attributes.pathname),
  ],
} satisfies Config;
