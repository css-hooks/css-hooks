import { component$ } from "@builder.io/qwik";
import * as V from "varsace";
import matter from "gray-matter";
import { type DocumentHead, routeLoader$, z } from "@builder.io/qwik-city";
import { Anchor } from "~/components/anchor";

export const head: DocumentHead = {
  title: "Documentation",
  meta: [
    {
      name: "description",
      content:
        "Learn everything about CSS Hooks from first steps to advanced topics.",
    },
  ],
};

const documents = import.meta.glob("../../../../docs/*/index.md", {
  import: "default",
  as: "raw",
  eager: false,
});

const docsBase = "../../../../docs";

export const useIndex = routeLoader$(async () => {
  const items = await Promise.all(
    Object.entries(documents).map(async ([path, getContent]) => {
      const { data } = matter(await getContent());
      const { title, description, order } = /\/api\//.test(path)
        ? {
            title: "API",
            description: "Comprehensive API reference",
            order: 99,
          }
        : z
            .object({
              title: z.string(),
              description: z.optional(z.string()),
              order: z.number(),
            })
            .parse(data);
      return {
        path: path.substring(docsBase.length + 1).replace(/\/index\.md$/, ""),
        title,
        description,
        order,
      };
    }),
  );
  return items.sort((a, b) =>
    a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
  );
});

export default component$(() => {
  const items = useIndex();
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
        style={{
          listStyleType: "none",
          margin: 0,
          padding: "2em",
          display: "flex",
          flexDirection: "column",
          gap: "2em",
          background: V.gray85,
        }}
      >
        {items.value.map(({ path, title, description }) => (
          <li key={path}>
            <span style={{ fontSize: "1.5em" }}>
              <Anchor href={`/docs/${path}`}>{title}</Anchor>
            </span>
            <br />
            {description}
          </li>
        ))}
      </ol>
    </main>
  );
});
