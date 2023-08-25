import "./globals.css";
import type { Metadata } from "next";
import hooks from "@hooks.css/react";

export const metadata: Metadata = {
  title: "CSS Hooks",
  description: "Use advanced CSS features in inline styles",
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
        })}
      >
        {children}
      </body>
    </html>
  );
}
