import { css } from "@/css";
import { CSSProperties } from "react";
import { Assistant } from "next/font/google";
import LogoIcon from "./LogoIcon";
import { gray10, gray90 } from "varsace";

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
        style={css({
          color: gray90,
          "@media (prefers-color-scheme: dark)": { color: gray10 },
        })}
      >
        CSS Hooks
      </div>
    </div>
  );
}
