import "./globals.css";
import type { Metadata } from "next";
import hooks from "@hooks.css/react";

const title = "CSS Hooks";
const description =
  "Everything inline styles shouldn't be able to do. State-driven styling, dark mode, and more.";

export const metadata: Metadata = {
  title,
  metadataBase: new URL("https://css-hooks.com"),
  description,
  openGraph: {
    title,
    description,
  },
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
