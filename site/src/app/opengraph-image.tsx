import { ImageResponse } from "next/server";
import LogoIcon from "@/components/LogoIcon";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#282730",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 384,
          ...size,
        }}
      >
        <LogoIcon color1="#53a3ee" color2="#b4b4c5" />
      </div>
    ),
    size,
  );
}
