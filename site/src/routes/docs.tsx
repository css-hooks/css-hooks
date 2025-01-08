import { pipe } from "remeda";
import * as V from "varsace";

import { NavLink } from "../components/nav-link.tsx";
import { dark, not, on } from "../css.ts";
import { docs } from "../data/docs.ts";
import { createMetaDescriptors } from "../data/meta.ts";
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
        margin: "1rem auto",
        width: "calc(100% - 4rem)",
        maxWidth: "60ch",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "2.2rem",
          fontWeight: 400,
          lineHeight: 1.25,
          marginBlock: "1.375rem",
        }}
      >
        Documentation
      </h1>
      <ol
        style={pipe(
          {
            listStyleType: "none",
            margin: 0,
            padding: "2em",
            display: "flex",
            flexDirection: "column",
            gap: "2em",
          },
          on(dark, {
            background: V.gray85,
          }),
          on(not(dark), {
            boxShadow: `0 0 0 1px ${V.gray20}`,
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
              <span style={{ fontSize: "1.5em" }}>
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
