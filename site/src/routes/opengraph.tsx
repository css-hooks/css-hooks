import * as V from "varsace";
import { Logo } from "../components/logo.js";
import { JSXChild } from "hastx/jsx-runtime";
import { Head } from "../components/head.js";
import { Body } from "../components/body.js";
import { Html } from "../components/html.js";
import { Route } from "../route.js";

export default (): Route[] => [
  {
    pathname: "/opengraph.png",
    render: () => ({
      metadata: {
        width: 1200,
        height: 630,
      },
      content: (
        <Html>
          <Head />
          <Body>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100dvw",
                height: "100dvh",
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
                <Logo size="8rem" theme="dark" />
              </div>
              <Banner>
                <div>native inline styles.</div>
              </Banner>
            </div>
          </Body>
        </Html>
      ),
    }),
  },
];

function Banner({ children }: { children?: JSXChild }) {
  return (
    <div
      style={{
        padding: "1em",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        lineHeight: 1,
        fontSize: "2.5rem",
        letterSpacing: "-0.03em",
        color: V.gray50,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
}
