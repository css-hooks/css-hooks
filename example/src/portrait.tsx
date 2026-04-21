import portraitSvg from "./portrait.svg?raw";

export function Portrait() {
  return (
    <div
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "oklch(87% 0.04 80)",
        overflow: "hidden",
      }}
      dangerouslySetInnerHTML={{ __html: portraitSvg }}
    />
  );
}
