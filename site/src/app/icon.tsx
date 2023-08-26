import { ImageResponse } from "next/server";
import LogoIcon from "@/components/LogoIcon";

export const size = { width: 32, height: 32 };

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 24,
          ...size,
        }}
      >
        <div
          style={{
            background: "#282730",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...size,
            borderRadius: 9999,
          }}
        >
          <LogoIcon color1="#53a3ee" color2="#b4b4c5" />
        </div>
      </div>
    ),
    size,
  );
}
