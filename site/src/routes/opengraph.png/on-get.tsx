// @ts-ignore
import assistant from "@fontsource/assistant/files/assistant-latin-400-normal.woff?arraybuffer";
// @ts-ignore
import inter from "@fontsource/inter/files/inter-latin-700-normal.woff?arraybuffer";

import type { RequestHandler } from "@builder.io/qwik-city";
import { renderToString } from "@builder.io/qwik/server";
import satori from "satori";
import { html as satoriHTML } from "satori-html";
import * as resvg from "@resvg/resvg-js";
import * as V from "varsace";
import { Logo } from "~/components/logo";
import { Slot, component$ } from "@builder.io/qwik";

const Banner = component$(() => (
  <div
    style={{
      padding: "1em",
      fontFamily: "'Inter Variable', sans-serif",
      lineHeight: 1,
      fontSize: "2.5rem",
      letterSpacing: "-0.03em",
      color: V.gray50,
      display: "flex",
    }}
  >
    <Slot />
  </div>
));

export const onGet: RequestHandler = async requestEvent => {
  const width = 1200;
  const height = 630;

  const { html } = await renderToString(
    <body>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          background: V.gray85,
        }}
      >
        <Banner>
          <div style={{ display: "flex", gap: "0.2em" }}>
            Do the
            <span
              style={{
                color: V.pink30,
              }}
            >
              impossible
            </span>
            with
          </div>
        </Banner>
        <div
          style={{
            width: "100%",
            flex: 1,
            background: V.gray90,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Logo theme="dark" size="8rem" />
        </div>
        <Banner>
          <div>native inline styles.</div>
        </Banner>
      </div>
    </body>,
    { qwikLoader: { include: "never" } },
  );

  const jsx = satoriHTML(
    (html.match(/<body[^>]*>(.*)?<\/body>/m)?.[1] || "").replace(
      /q:[a-z-]+="([^"]*)?"/g,
      "",
    ),
  ) as Parameters<typeof satori>[0];

  const svg = await satori(jsx, {
    fonts: [
      {
        name: "Assistant Variable",
        data: assistant,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter Variable",
        data: inter,
        weight: 700,
        style: "normal",
      },
    ],
    width,
    height,
  });

  const image = await resvg.renderAsync(svg);

  requestEvent.send(
    new Response(image.asPng(), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    }),
  );
};
