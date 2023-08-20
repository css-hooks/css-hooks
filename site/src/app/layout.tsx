import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import hooks from "@hooks.css/react";

const sans = Inter({ subsets: ["latin"] });

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
        className={`hooks ${sans.className}`}
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
