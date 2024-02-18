import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$, useLocation, z } from "@builder.io/qwik-city";
import * as V from "varsace";
import matter from "gray-matter";
import { css } from "~/css";
import { Anchor } from "~/components/anchor";
import * as Icon from "~/components/icons";

const documents = import.meta.glob("../../../../../docs/**/index.md", {
  import: "default",
  as: "raw",
  eager: false,
});

const docsBase = "../../../../../docs";

type MenuItem = {
  path: string;
  title: string;
  order: number;
  childItems: MenuItem[];
};

export const useMenu = routeLoader$(async () => {
  const items = await Promise.all(
    Object.entries(documents).map(async ([path, getContent]) => {
      const { data } = matter(await getContent());
      const { title, order } = /\/api\//.test(path)
        ? { title: "API", order: 99 }
        : z.object({ title: z.string(), order: z.number() }).parse(data);
      return {
        path: path.substring(docsBase.length + 1).replace(/\/index\.md$/, ""),
        title,
        order,
        childItems: [],
      } as MenuItem;
    }),
  );
  const menu: MenuItem[] = [];
  for (const item of items) {
    const parent = items.find(
      ({ path }) =>
        path !== item.path && path === item.path.replace(/\/[^/]+$/, ""),
    );
    if (parent) {
      parent.childItems.push(item);
    } else {
      menu.push(item);
    }
  }
  return menu;
});

const MenuList = component$(() => (
  <ol
    class="group"
    style={css({
      listStyleType: "none",
      margin: 0,
      padding: 0,
      paddingLeft: 0,
      on: $ => [
        $(".group &.group", {
          paddingLeft: "2em",
        }),
      ],
    })}
  >
    <Slot />
  </ol>
));

const MenuItem = component$(({ path, title, childItems }: MenuItem) => {
  const fullPath = `/docs/${path}/`;
  const location = useLocation();
  return (
    <li style={{ marginTop: "0.25em" }}>
      <Anchor
        href={fullPath}
        selected={
          childItems.length
            ? location.url.pathname === fullPath
            : location.url.pathname.startsWith(fullPath)
        }
      >
        {title}
      </Anchor>
      {childItems.length ? (
        <MenuList>
          {childItems
            .sort((a, b) =>
              a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
            )
            .map(child => (
              <MenuItem key={child.path} {...child} />
            ))}
        </MenuList>
      ) : undefined}
    </li>
  );
});

export default component$(() => {
  const menu = useMenu();
  return (
    <div
      style={css({
        display: "flex",
        flex: 1,
        on: ($, { or }) => [
          $(or("@media (width < 450px)", "@media (450px <= width < 700px)"), {
            flexDirection: "column",
          }),
        ],
      })}
    >
      <nav
        style={css({
          background: V.gray05,
          boxSizing: "border-box",
          on: ($, { or, not }) => [
            $("@media (prefers-color-scheme: dark)", {
              background: V.gray85,
            }),
            $(
              not(
                or("@media (width < 450px)", "@media (450px <= width < 700px)"),
              ),
              {
                flexBasis: "24ch",
                flexShrink: 0,
              },
            ),
          ],
        })}
      >
        <label
          style={css({
            display: "flex",
            alignItems: "center",
            padding: "1rem",
            gap: "0.25rem",
            fontSize: "1.25rem",
            color: V.gray60,
            outlineWidth: 0,
            outlineColor: V.blue20,
            outlineStyle: "solid",
            outlineOffset: -2,
            on: ($, { and, or }) => [
              $("@media (prefers-color-scheme: dark)", {
                outlineColor: V.blue50,
                color: V.gray40,
              }),
              $("&:focus-visible-within", {
                outlineWidth: 2,
              }),
              $(or("&:hover", "&:active"), {
                background: V.white,
              }),
              $("&:hover", {
                color: V.blue50,
              }),
              $("&:active", {
                color: V.red50,
              }),
              $(
                and(
                  or("&:hover", "&:active"),
                  "@media (prefers-color-scheme: dark)",
                ),
                {
                  background: V.gray80,
                },
              ),
              $(and("&:hover", "@media (prefers-color-scheme: dark)"), {
                color: V.blue20,
              }),
              $(and("&:active", "@media (prefers-color-scheme: dark)"), {
                color: V.red20,
              }),
              $(
                or(
                  "@media (700px <= width < 1100px)",
                  "@media (1100px <= width)",
                ),
                {
                  display: "none",
                },
              ),
            ],
          })}
        >
          <input type="checkbox" style={{ width: 0, height: 0, margin: 0 }} />
          <div
            style={css({
              display: "inline-flex",
              on: ($, { not }) => [
                $(not(":checked + &"), {
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                }),
              ],
            })}
          >
            <Icon.ExpandMore />
          </div>
          <span>Contents</span>
        </label>
        <div
          style={css({
            marginTop: "0.5em",
            paddingTop: 0,
            paddingRight: "1.75rem",
            paddingBottom: "1.75rem",
            paddingLeft: "1.75rem",
            on: ($, { not, or }) => [
              $(
                not(
                  or(
                    ":has(:checked) + &",
                    "@media (700px <= width < 1100px)",
                    "@media (1100px <= width)",
                  ),
                ),
                {
                  display: "none",
                },
              ),
              $(
                or(
                  "@media (700px <= width < 1100px)",
                  "@media (1100px <= width)",
                ),
                {
                  position: "fixed",
                  marginTop: "-0.5em",
                  paddingTop: "2rem",
                  paddingRight: "2rem",
                  paddingBottom: "2rem",
                  paddingLeft: "2rem",
                },
              ),
            ],
          })}
        >
          <MenuList>
            {menu.value
              .sort((a, b) =>
                a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
              )
              .map(props => (
                <MenuItem key={props.path} {...props} />
              ))}
          </MenuList>
        </div>
      </nav>
      <main
        style={{ flexGrow: 1, flexShrink: 1, minWidth: 0, lineHeight: 1.5 }}
      >
        <div
          style={css({
            width: "calc(100% - 4rem)",
            maxWidth: "88ch",
            margin: "auto",
            padding: "1rem 0",
            on: $ => [
              $("@media (1100px <= width)", {
                width: "calc(100% - 8rem)",
              }),
            ],
          })}
        >
          <Slot />
        </div>
        <div style={{ height: "2rem" }} />
      </main>
    </div>
  );
});
