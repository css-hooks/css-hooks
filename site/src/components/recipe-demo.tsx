import type { KeyboardEvent, ReactNode } from "react";
import { useState } from "react";

import { and, dark, hover, mergeStyles, on } from "../css.ts";
import { gray, purple, white } from "../design/colors.ts";
import { monospace } from "../design/typography.ts";
import { CheckIcon, ContentCopyIcon } from "./icons.tsx";
import { Preformatted } from "./preformatted.tsx";

// Shared height so the preview and source panes line up in two-column mode.
const paneHeight = 600;

export function RecipeDemo({
  children,
  files,
  highlightedFiles,
  styleSheet,
}: {
  children: ReactNode;
  files: Record<string, string>;
  highlightedFiles: Record<string, string>;
  styleSheet: string;
}) {
  const filenames = Object.keys(files);
  const [activeFile, setActiveFile] = useState(filenames[0] ?? "");
  const code = files[activeFile] ?? "";

  const selectAdjacentTab = (
    event: KeyboardEvent<HTMLButtonElement>,
    offset: number,
  ) => {
    event.preventDefault();
    const index = filenames.indexOf(activeFile);
    setActiveFile(
      filenames[(index + offset + filenames.length) % filenames.length] ?? "",
    );
  };

  return (
    <section
      style={{ containerType: "inline-size", width: "100%", marginBlock: 24 }}
    >
      <div
        style={mergeStyles(
          { display: "grid", gridTemplateColumns: "1fr" },
          on("@container (width >= 1000px)", {
            // Keep the source column wide enough for a 60-column example; the
            // preview shrinks to at least 300px before falling back to stacked.
            gridTemplateColumns: "minmax(0, 1fr) minmax(700px, 1fr)",
            alignItems: "stretch",
          }),
        )}
      >
        <div
          style={mergeStyles(
            {
              overflow: "auto",
              maxHeight: 560,
              borderTopWidth: 1,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderStyle: "solid",
              borderColor: gray(20),
              borderRadius: "12px 12px 0 0",
              background: white,
            },
            on(dark, {
              borderColor: gray(70),
              background: gray(85),
            }),
            on("@container (width >= 1000px)", {
              display: "grid",
              gridTemplateRows: "minmax(0, 1fr)",
              height: paneHeight,
              maxHeight: "none",
              borderRightWidth: 0,
              borderRadius: "12px 0 0 12px",
            }),
          )}
        >
          <style dangerouslySetInnerHTML={{ __html: styleSheet }} />
          {children}
        </div>
        <div
          style={mergeStyles(
            {
              overflow: "hidden",
              borderTopWidth: 0,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderStyle: "solid",
              borderColor: gray(20),
              borderRadius: "0 0 12px 12px",
              background: white,
            },
            on(dark, {
              borderColor: gray(70),
              background: gray(85),
            }),
            on("@container (width >= 1000px)", {
              display: "flex",
              flexDirection: "column",
              height: paneHeight,
              borderTopWidth: 1,
              borderLeftWidth: 0,
              borderRadius: "0 12px 12px 0",
            }),
          )}
        >
          <div
            style={mergeStyles(
              {
                display: "flex",
                flexShrink: 0,
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderColor: gray(20),
                background: gray(10),
              },
              on(dark, {
                borderColor: gray(70),
                background: gray(80),
              }),
            )}
          >
            <div
              role="tablist"
              aria-label="Recipe files"
              style={{
                display: "flex",
                minWidth: 0,
                flex: 1,
                overflowX: "auto",
              }}
            >
              {filenames.map(filename => {
                const selected = filename === activeFile;
                return (
                  <button
                    key={filename}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveFile(filename)}
                    onKeyDown={event => {
                      if (event.key === "ArrowLeft")
                        selectAdjacentTab(event, -1);
                      if (event.key === "ArrowRight")
                        selectAdjacentTab(event, 1);
                    }}
                    style={mergeStyles(
                      {
                        border: 0,
                        borderBottomWidth: 2,
                        borderBottomStyle: "solid",
                        borderBottomColor: selected
                          ? purple(55)
                          : "transparent",
                        padding: "10px 16px 8px",
                        background: "transparent",
                        color: selected ? gray(90) : gray(60),
                        fontFamily: monospace,
                        fontSize: 14,
                        cursor: "pointer",
                      },
                      on(hover, { color: gray(90) }),
                      on(dark, { color: selected ? white : gray(35) }),
                      on(and(dark, hover), { color: white }),
                      on("&:focus-visible", {
                        outlineWidth: 2,
                        outlineStyle: "solid",
                        outlineColor: purple(35),
                        outlineOffset: -3,
                      }),
                    )}
                  >
                    {filename}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              data-copy-code={code}
              aria-label="Copy code"
              title="Copy code"
              style={mergeStyles(
                {
                  flexShrink: 0,
                  alignSelf: "center",
                  boxSizing: "border-box",
                  display: "inline-grid",
                  placeItems: "center",
                  width: 28,
                  height: 28,
                  marginInline: 8,
                  padding: 4,
                  border: 0,
                  borderRadius: 4,
                  background: "transparent",
                  color: gray(60),
                  cursor: "pointer",
                  fontSize: 16,
                  lineHeight: 1,
                  outlineWidth: 0,
                  outlineStyle: "solid",
                  outlineColor: purple(20),
                  outlineOffset: 2,
                },
                on(hover, { background: gray(15), color: gray(75) }),
                on("&:active", { background: gray(20), color: gray(85) }),
                on(dark, {
                  color: gray(35),
                  outlineColor: purple(50),
                }),
                on(and(dark, hover), {
                  background: gray(75),
                  color: gray(15),
                }),
                on(and(dark, "&:active"), {
                  background: gray(70),
                  color: white,
                }),
                on("&:focus-visible", { outlineWidth: 2 }),
              )}
            >
              <span data-copy-icon style={{ gridArea: "1 / 1" }}>
                <ContentCopyIcon />
              </span>
              <span data-copied-icon hidden style={{ gridArea: "1 / 1" }}>
                <CheckIcon />
              </span>
            </button>
          </div>
          <div
            role="tabpanel"
            aria-label={activeFile}
            style={mergeStyles(
              { minHeight: 0 },
              on("@container (width >= 1000px)", { flex: 1 }),
            )}
          >
            <pre
              style={mergeStyles(
                {
                  margin: 0,
                  padding: 20,
                  maxHeight: 560,
                  overflow: "auto",
                },
                on("@container (width >= 1000px)", {
                  boxSizing: "border-box",
                  height: "100%",
                  maxHeight: "none",
                }),
              )}
            >
              {highlightedFiles[activeFile] ? (
                <Preformatted
                  as="div"
                  dangerouslySetInnerHTML={{
                    __html: highlightedFiles[activeFile],
                  }}
                />
              ) : (
                <Preformatted as="div">{code}</Preformatted>
              )}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
