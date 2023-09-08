import hooks from "@/css-hooks";
import { CSSProperties } from "react";
import { Assistant } from "next/font/google";
import LogoIcon from "./LogoIcon";

const assistant = Assistant({ subsets: ["latin"], weight: ["400"] });

export default function Logo({
  size = "2rem",
}: {
  size?: CSSProperties["fontSize"];
}) {
  return (
    <div
      className={assistant.className}
      style={{
        fontSize: `${size}`,
        letterSpacing: "-0.05em",
        display: "flex",
        alignItems: "center",
        gap: "0.125em",
        lineHeight: 1,
      }}
    >
      <LogoIcon />
      <div
        style={hooks({
          color: "var(--gray-900)",
          dark: { color: "var(--gray-200)" },
        })}
      >
        CSS Hooks
      </div>
    </div>
  );
}
