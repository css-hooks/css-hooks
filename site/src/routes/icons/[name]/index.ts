import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import { onGet } from "./on-get";

export { onGet };

export const onStaticGenerate: StaticGenerateHandler = () => ({
  params: [
    "icon-16x16.png",
    "icon-32x32.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
  ].map(name => ({ name })),
});
