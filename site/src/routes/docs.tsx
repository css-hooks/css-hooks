import { pipe } from "remeda";

import { NavLink } from "../components/nav-link.tsx";
import { dark, not, on } from "../css.ts";
import { docs } from "../data/docs.ts";
import { createMetaDescriptors } from "../data/meta.ts";
import { gray } from "../design/colors.ts";
import type { Route } from "./+types/docs.ts";

export const meta: Route.MetaFunction = createMetaDescriptors({
  title: "Documentation",
  description:
    "Learn everything about CSS Hooks from first steps to advanced topics.",
});

export default function Docs() {
  return (
    <main
      style={{
        marginBlock: 16,
        marginInline: "auto",
        width: "calc(100% - 64px)",
        maxWidth: "60ch",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "2em",
          fontWeight: 400,
          lineHeight: 1.25,
          marginBlockStart: 0,
          marginBlockEnd: 16,
        }}
      >
        Documentation
      </h1>
      <ol
        style={pipe(
          {
            listStyleType: "none",
            margin: 0,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 32,
          },
          on(dark, {
            background: gray(85),
          }),
          on(not(dark), {
            boxShadow: `0 0 0 1px ${gray(20)}`,
          }),
        )}
      >
        {docs
          .filter(
            ({ attributes: { level, order } }) => level === 0 && order >= 0,
          )
          .sort(({ attributes: { order: a } }, { attributes: { order: b } }) =>
            a < b ? -1 : a > b ? 1 : 0,
          )
          .map(({ attributes: { pathname, title, description } }) => (
            <li key={pathname}>
              <span style={{ fontSize: "1.5em", lineHeight: 4 / 3 }}>
                <NavLink to={pathname}>{title}</NavLink>
              </span>
              <br />
              {description}
            </li>
          ))}
      </ol>
    </main>
  );
}
