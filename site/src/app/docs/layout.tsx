import Logo from "@/components/Logo";
import PageBlock from "@/components/PageBlock";
import hooks from "@hooks.css/react";
import { ReactNode } from "react";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header
        style={hooks({
          padding: "2rem",
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
      <PageBlock style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        {children}
      </PageBlock>
    </div>
  );
}
