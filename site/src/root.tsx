import "./global.css";

import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import * as V from "varsace";
import { RouterHead } from "./components/router-head/router-head";
import { css, styleSheet } from "./css";
import * as Theme from "./theme";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <script
          dangerouslySetInnerHTML={`
            (function() {
              var theme = localStorage.getItem("theme");
              if (!~${JSON.stringify(Theme.options)}.indexOf(theme)) {
                theme = ${JSON.stringify(Theme.defaultOption)};
              }
              document.documentElement.setAttribute("data-theme", theme);
              window.addEventListener("load", function() {
                var switcher = document.getElementById(${JSON.stringify(
                  Theme.switcherId,
                )});
                if (switcher instanceof HTMLSelectElement) {
                  switcher.value = theme;
                  switcher.addEventListener("change", function(e) {
                    var theme = e.target.value;
                    document.documentElement.setAttribute("data-theme", theme);
                    localStorage.setItem("theme", theme);
                  });
                }
              });
            })()
          `}
        />
        <style dangerouslySetInnerHTML={styleSheet()} />
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body
        lang="en"
        style={css({
          fontFamily: "'Inter Variable'",
          lineHeight: 1.25,
          margin: 0,
          background: V.white,
          color: V.gray90,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          match: on => [
            on("@media (prefers-color-scheme: dark)", {
              background: V.gray90,
              color: V.white,
            }),
          ],
        })}
      >
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
