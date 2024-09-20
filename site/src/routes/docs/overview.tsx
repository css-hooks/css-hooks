import { pipe } from "remeda";
import * as V from "varsace";

import { Anchor } from "../../components/anchor.js";
import { Body } from "../../components/body.js";
import { Head } from "../../components/head.js";
import { Html } from "../../components/html.js";
import { PageLayout } from "../../components/page-layout.js";
import { PageMeta } from "../../components/page-meta.js";
import { dark, not, on } from "../../css.js";
import type { Route } from "../../route.js";
import { getArticles } from "./data.js";

const pathname = "/docs/";

export default (): Route[] => [
  {
    pathname,
    render: async () => ({
      content: await Overview(),
    }),
  },
];

async function Overview() {
  return (
    <Html>
      <Head>
        <PageMeta
          pathname={pathname}
          title="Documentation"
          description="Learn everything about CSS Hooks from first steps to advanced topics."
        />
      </Head>
      <Body>
        <PageLayout pathname={pathname}>
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
              {(await getArticles())
                .filter(article => article.level === 0 && article.order >= 0)
                .sort((a, b) =>
                  a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
                )
                .map(({ pathname, title, description }) => (
                  <li>
                    <span style={{ fontSize: "1.5em" }}>
                      <Anchor href={pathname}>{title}</Anchor>
                    </span>
                    <br />
                    {description}
                  </li>
                ))}
            </ol>
          </main>
        </PageLayout>
      </Body>
    </Html>
  );
}
