import Logo from "@/components/Logo";
import PageBlock from "@/components/PageBlock";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import * as prettier from "prettier/standalone";
import * as prettierEstree from "prettier/plugins/estree";
import * as prettierTypescript from "prettier/plugins/typescript";
import hooks from "@hooks.css/react";
import Typography from "@/components/Typography";
import { exhausted } from "@/util/exhausted";

const codeExample = `
<a
  href="https://css-hooks.com/"
  className="hooks"
  style={hooks({
    color: "#03f",
    hover: {
      color: "#09f",
    },
    active: {
      color: "#e33",
    },
  })}>
  Get Hooked
</a>
`;

export default async function Home() {
  return (
    <div>
      <header
        style={hooks({
          background: "var(--gray-100)",
          dark: { background: "var(--gray-950)" },
          padding: "2rem",
          display: "grid",
          placeItems: "center",
        })}
      >
        <PageBlock>
          <Logo size="2rem" />
        </PageBlock>
      </header>
      <main>
        <div
          style={hooks({
            background: "var(--gray-100)",
            dark: { background: "var(--gray-950)" },
          })}
        >
          <PageBlock
            style={{
              paddingTop: "2rem",
              paddingBottom: "2rem",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
              gap: "2rem 8rem",
            }}
          >
            <section>
              <Typography variant="bold3XL">
                {({ className, style, ...restProps }) =>
                  exhausted(restProps) && (
                    <h1 className={className} style={style}>
                      Everything inline styles aren&apos;t supposed to be able
                      to do.
                    </h1>
                  )
                }
              </Typography>
              <Typography variant="regularXL">
                {({ className, style, ...restProps }) =>
                  exhausted(restProps) && (
                    <p
                      className={className}
                      style={{ ...style, margin: 0, marginTop: "2rem" }}
                    >
                      With zero runtime, no build steps, and a tiny CSS
                      footprint, hooks bring advanced CSS capabilities to native
                      inline styles.
                    </p>
                  )
                }
              </Typography>
              <Typography variant="boldLarge">
                {({ className, style, ...restProps }) =>
                  exhausted(restProps) && (
                    <a
                      href="https://github.com/css-hooks/css-hooks"
                      className={className}
                      style={hooks({
                        ...style,
                        textDecoration: "none",
                        background: "var(--blue-800)",
                        color: "var(--white)",
                        padding: "0.5em 0.75em",
                        display: "inline-block",
                        marginTop: "2em",
                        hover: {
                          background: "var(--blue-700)",
                        },
                        active: {
                          background: "var(--red-700)",
                        },
                      })}
                    >
                      Get started
                    </a>
                  )
                }
              </Typography>
            </section>
            <section
              style={hooks({
                background: "var(--white)",
                padding: "2rem",
                dark: { background: "var(--black)" },
              })}
            >
              <pre style={{ margin: 0 }}>
                <SyntaxHighlighter language="typescript">
                  {(
                    await prettier.format(codeExample, {
                      plugins: [prettierEstree, prettierTypescript],
                      parser: "typescript",
                    })
                  ).replace(/;$/gm, "")}
                </SyntaxHighlighter>
              </pre>
            </section>
          </PageBlock>
        </div>
      </main>
    </div>
  );
}
