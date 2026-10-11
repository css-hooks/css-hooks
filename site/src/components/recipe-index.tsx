import { and, dark, hover, mergeStyles, not, on } from "../css.ts";
import { docs } from "../data/docs.ts";
import { gray, purple, white } from "../design/colors.ts";
import { proseWidth } from "../design/layout.ts";
import { monospace } from "../design/typography.ts";
import { NavLink } from "./nav-link.tsx";

export function RecipeIndex() {
  const items = docs
    .filter(
      ({ attributes: { hidden, order, pathname } }) =>
        hidden && order >= 0 && pathname.startsWith("/docs/recipes/"),
    )
    .sort(({ attributes: { order: a } }, { attributes: { order: b } }) => a - b)
    .map(({ attributes: { pathname, title, description } }) => ({
      href: pathname,
      title,
      description,
    }));

  // The rules live on the layout container (via grid row gaps and borders)
  // rather than on the tiles, so they span the full width even when the last
  // row is partially filled and never collide with a tile's focus ring.
  const cellStyle = mergeStyles(
    { backgroundColor: white, display: "grid", placeItems: "stretch" },
    on(dark, { backgroundColor: gray(90) }),
  );

  return (
    <ol
      style={mergeStyles(
        {
          backgroundColor: gray(20),
          borderColor: gray(20),
          borderStyle: "solid",
          borderBlockWidth: 1,
          borderInlineWidth: 0,
          boxSizing: "border-box",
          maxWidth: proseWidth,
          marginBlock: "32px 0",
          marginInline: "auto",
          listStyle: "none",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "1fr",
          columnGap: 0,
          rowGap: 1,
        },
        on("@media (width >= 69em)", {
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        }),
        on(dark, {
          backgroundColor: gray(70),
          borderColor: gray(70),
        }),
      )}
    >
      {items.map(({ title, description, href }, index) => (
        <li key={href} style={cellStyle}>
          <NavLink
            to={href}
            style={mergeStyles(
              {
                outlineOffset: -2,
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: "3ch 1fr auto",
                gap: 16,
                width: "100%",
                minHeight: 152,
                padding: "28px 24px",
                color: "inherit",
                textDecoration: "none",
              },
              on(hover, { background: gray(10) }),
              on(and(dark, hover), { background: gray(85) }),
            )}
          >
            <span
              aria-hidden="true"
              style={{ color: purple(55), fontFamily: monospace }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <strong
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: "1.25em",
                  fontWeight: 500,
                  lineHeight: 1.25,
                }}
              >
                {title}
              </strong>
              <span
                style={mergeStyles(
                  { color: gray(60) },
                  on(dark, { color: gray(47) }),
                )}
              >
                {description}
              </span>
            </span>
            <span aria-hidden="true" style={{ color: purple(55) }}>
              &gt;
            </span>
          </NavLink>
        </li>
      ))}
      {items.length % 2 === 1 ? (
        <li
          aria-hidden="true"
          style={mergeStyles(
            cellStyle,
            on(not("@media (width >= 69em)"), { display: "none" }),
          )}
        />
      ) : (
        <></>
      )}
    </ol>
  );
}
