import puppeteer from "puppeteer";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";

import { Logo } from "../components/logo.tsx";
import { styleSheet } from "../css.ts";
import { gray, pink } from "../design/colors.ts";

export async function loader() {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630 });

  await page.setContent(
    "<!DOCTYPE html>" +
      renderToString(
        <body style={{ margin: 0 }} data-theme="dark">
          <link
            href="https://fonts.googleapis.com/css2?family=Assistant&family=Inter&display=swap"
            rel="stylesheet"
          />
          <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100dvw",
              height: "100dvh",
              background: gray(85),
            }}
          >
            <Banner>
              <div style={{ display: "flex", gap: "0.2em" }}>
                Do the
                <span
                  style={{
                    color: pink(30),
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
                background: gray(90),
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Logo size="8rem" />
            </div>
            <Banner>
              <div>native inline styles.</div>
            </Banner>
          </div>
        </body>,
      ),
  );

  await page.waitForNetworkIdle({ idleTime: 1 });

  const image = await page.screenshot({ type: "png" });

  await browser.close();

  return new Response(image, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}

function Banner({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        padding: "1em",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        lineHeight: 1,
        fontSize: "2.5rem",
        letterSpacing: "-0.03em",
        color: gray(55),
        display: "flex",
      }}
    >
      {children}
    </div>
  );
}
