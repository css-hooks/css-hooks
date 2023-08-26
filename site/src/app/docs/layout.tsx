import { ReactNode } from "react";
import Link from "next/link";
import hooks from "@hooks.css/react";
import Logo from "@/components/Logo";
import PageBlock from "@/components/PageBlock";
import { exhausted } from "@/util/exhausted";
import Typography from "@/components/Typography";
import DocLink from "./DocLink";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header
        style={hooks({
          marginLeft: "calc(100% - 100vw)",
          padding: "2rem",
          paddingLeft: "calc(2rem + 100vw - 100%)",
          background: "var(--gray-100)",
          dark: { background: "var(--gray-950)" },
        })}
      >
        <PageBlock>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Logo size="2rem" />
          </Link>
        </PageBlock>
      </header>
      <PageBlock
        style={{
          marginTop: "2rem",
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <nav style={{ flex: 1, minWidth: "20ch" }}>
          <Typography variant="boldLarge" margins>
            {({ className, style, ...restProps }) =>
              exhausted(restProps) && (
                <h1
                  className={className}
                  style={{ ...style, color: "var(--gray-500)" }}
                >
                  Documentation
                </h1>
              )
            }
          </Typography>
          <Typography variant="regularBase">
            {({ className, style, ...restProps }) =>
              exhausted(restProps) && (
                <ul
                  className={className}
                  style={{
                    ...style,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em",
                    listStyle: "none",
                    padding: 0,
                  }}
                >
                  {[
                    ["Getting started", "/docs/getting-started"],
                    ["API", "/docs/api"],
                    ["Hooks reference", "/docs/hooks-reference"],
                  ].map(([name, href]) => (
                    <li key={name}>
                      <DocLink href={href}>{name}</DocLink>
                    </li>
                  ))}
                </ul>
              )
            }
          </Typography>
        </nav>
        <div style={{ flex: 3, minWidth: "60ch" }}>{children}</div>
      </PageBlock>
    </>
  );
}
