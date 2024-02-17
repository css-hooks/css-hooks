import type { RequestHandler } from "@builder.io/qwik-city";
import { renderToString } from "@builder.io/qwik/server";
import * as resvg from "@resvg/resvg-js";
import { EmblemContained } from "~/components/emblem";

const sizes = {
  "icon-16x16.png": 16,
  "icon-32x32.png": 32,
  "apple-touch-icon.png": 180,
  "android-chrome-192x192.png": 192,
  "android-chrome-512x512.png": 512,
};

export const onGet: RequestHandler = async ({ params, send }) => {
  const { name } = params;

  if (!(name in sizes)) {
    send(404, "Not found");
    return;
  }

  const size =
    name in sizes ? sizes[name as keyof typeof sizes] : sizes["icon-32x32.png"];

  const { html } = await renderToString(
    <body>
      <EmblemContained theme="dark" size={size} />
    </body>,
    { qwikLoader: { include: "never" } },
  );

  const svg = (html.match(/<body[^>]*>(.*)?<\/body>/m)?.[1] || "")
    .replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`)
    .replace(/q\:[a-z-]+="([^"]*)?"/g, "");

  const image = await resvg.renderAsync(svg);

  send(
    new Response(image.asPng(), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    }),
  );
};
