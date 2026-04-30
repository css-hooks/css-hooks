import { chromium } from "playwright";
import { renderToString } from "react-dom/server";

import { Logo } from "../components/logo.tsx";
import { styleSheet } from "../css.ts";
import { gray } from "../design/colors.ts";

export async function loader() {
  const browser = await chromium.launch();

  const page = await browser.newPage();

  await page.setViewportSize({ width: 1200, height: 630 });

  await page.setContent(
    "<!DOCTYPE html>" +
      renderToString(
        <body style={{ margin: 0 }} data-theme="dark">
          <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: "100dvw",
              height: "100dvh",
              background: gray(90),
            }}
          >
            <Logo height="8rem" />
          </div>
        </body>,
      ),
  );

  await page.waitForLoadState("networkidle");

  const image = await page.screenshot({ type: "png" });

  await browser.close();

  return new Response(Buffer.from(image), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
