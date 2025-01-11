import puppeteer from "puppeteer";
import { renderToString } from "react-dom/server";
import * as v from "valibot";

import { Emblem } from "../components/emblem.tsx";
import { styleSheet } from "../css.ts";
import { gray } from "../design/colors.ts";
import type { Route } from "./+types/icon.ts";

export async function loader({ params }: Route.LoaderArgs) {
  const NumberParamSchema = v.pipe(
    v.string(),
    v.regex(/^[0-9]+$/),
    v.transform(parseInt),
  );

  const paramsParseResult = v.safeParse(
    v.object({
      width: NumberParamSchema,
      height: NumberParamSchema,
    }),
    params,
  );

  if (!paramsParseResult.success) {
    throw new Response(null, { status: 404 });
  }

  const { width, height } = paramsParseResult.output;

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setViewport({ width, height });

  await page.setContent(
    "<!DOCTYPE html>" +
      renderToString(
        <body style={{ margin: 0 }} data-theme="dark">
          <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
          <div
            style={{
              background: gray(85),
              width: "100dvw",
              height: "100dvh",
              borderRadius: 9999,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100dvw",
              height: "100dvh",
              display: "grid",
              placeItems: "center",
              fontSize: "80dvmax",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                position: "relative",
                top: "-5dvh",
                left: "2.5dvw",
              }}
            >
              <Emblem />
            </div>
          </div>
        </body>,
      ),
  );

  const image = await page.screenshot({ type: "png", omitBackground: true });

  await browser.close();

  return new Response(image, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
