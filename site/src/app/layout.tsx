import "./globals.css";
import type { Metadata } from "next";
import hooks, { css } from "@/css-hooks";
import PageBlock from "@/components/PageBlock";
import { exhausted } from "@/util/exhausted";
import Logo from "@/components/Logo";
import NextLink from "next/link";
import Link from "@/components/Link";
import Typography from "@/components/Typography";

export const metadata: Metadata = {
  metadataBase: new URL("https://css-hooks.com"),
  title: "CSS Hooks",
  description:
    "Inline styles doing what we thought they couldn't: State-driven styling, dark mode, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={hooks({
          margin: 0,
          background: "var(--white)",
          color: "var(--black)",
          dark: {
            background: "var(--black)",
            color: "var(--white)",
          },
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        })}
      >
        <style>{css}</style>
        <div style={{ flex: 1 }}>{children}</div>
        <PageBlock>
          {({ style: pageBlockStyle, ...restProps }) =>
            exhausted(restProps) && (
              <Typography variant="regularBase">
                {({ className, style: typographyStyle, ...restProps }) =>
                  exhausted(restProps) && (
                    <footer
                      className={className}
                      style={{
                        ...typographyStyle,
                        ...pageBlockStyle,
                        paddingTop: "4rem",
                        paddingBottom: "1rem",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        textAlign: "center",
                        gap: "0.5rem 2rem",
                      }}
                    >
                      <Logo size="1.5rem" />
                      <div
                        style={{
                          flexBasis: "calc((60rem - 100%) * 999)",
                          flexGrow: 1,
                        }}
                      />
                      <nav
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: "inherit",
                        }}
                      >
                        <Link>
                          {({ style, ...restProps }) =>
                            exhausted(restProps) && (
                              <NextLink
                                key="Documentation"
                                href="/docs/react/getting-started"
                                style={style}
                              >
                                Documentation
                              </NextLink>
                            )
                          }
                        </Link>
                        {[
                          ["GitHub", "https://github.com/css-hooks/css-hooks"],
                          ["NPM", "https://www.npmjs.com/org/css-hooks"],
                          ["Twitter", "https://www.twitter.com/csshooks"],
                          ["Facebook", "https://www.facebook.com/csshooks"],
                        ].map(([children, href]) => (
                          <Link key={children} href={href}>
                            {children}
                          </Link>
                        ))}
                      </nav>
                    </footer>
                  )
                }
              </Typography>
            )
          }
        </PageBlock>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "b1c573f33b1d41c7bb345f7a741ed5f2"}`}
        />
      </body>
    </html>
  );
}
