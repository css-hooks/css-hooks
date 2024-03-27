import { component$ } from "@builder.io/qwik";
import {
  type StaticGenerateHandler,
  routeLoader$,
  useLocation,
  type DocumentHead,
  z,
} from "@builder.io/qwik-city";
import matter from "gray-matter";
import { Anchor } from "~/components/anchor";
import * as Markdown from "~/markdown";
import * as V from "varsace";
import * as Icon from "~/components/icons";
import { css } from "~/css";

const documents = import.meta.glob("../../../../../docs/**/*.md", {
  import: "default",
  query: "?raw",
  eager: false,
});

const docBase = "../../../../../docs";

const notFoundDoc = `
# Not found

The requested document does not exist.

Please proceed to the [Documentation](/docs) homepage so we can help you find what you're looking for.
`;

export const useDocument = routeLoader$(async requestEvent => {
  const { params } = requestEvent;
  const path = params.path.replace(/_/g, ".");
  const indexPath = `${docBase}/${path}/index.md`;
  const altPath = `${docBase}/${path}.md`;
  if (indexPath in documents || altPath in documents) {
    const isIndex = indexPath in documents;
    const markdown = matter(
      z.string().parse(await documents[isIndex ? indexPath : altPath]()),
    );
    return {
      path: (isIndex ? indexPath : altPath).replace(/^(.*)?\/docs\//, ""),
      failed: false,
      isIndex,
      content: (await Markdown.render(markdown.content)) || "",
      ...(/^api/.test(path)
        ? { title: "API", description: "Comprehensive API documentation" }
        : z
            .object({ title: z.string(), description: z.string() })
            .parse(markdown.data)),
    };
  }
  return requestEvent.fail(404, {
    errorMessage: await Markdown.render(notFoundDoc),
  });
});

export const head: DocumentHead = ({ resolveValue }) => {
  const document = resolveValue(useDocument);
  if (document.failed) {
    return {
      title: "Not found",
    };
  }
  const { title, description } = document;
  return {
    title,
    meta: [{ name: "description", content: description }],
  };
};

export default component$(() => {
  const location = useLocation();
  const document = useDocument();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {document.value.isIndex ? undefined : (
        <base href={location.url.toString().replace(/\/$/, "")} />
      )}
      <div
        dangerouslySetInnerHTML={
          document.value.content || document.value.errorMessage
        }
      />
      {document.value.failed ||
      /^api\//.test(document.value.path) ? undefined : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <hr
            style={css({
              margin: 0,
              border: 0,
              width: "100%",
              height: 1,
              background: V.gray10,
              on: $ => [
                $("@media (prefers-color-scheme: dark)", {
                  background: V.gray80,
                }),
              ],
            })}
          />
          <Anchor
            href={`https://github.com/css-hooks/css-hooks/edit/master/docs/${document.value.path}`}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25em",
              }}
            >
              <span style={{ display: "inline-flex" }} aria-hidden="true">
                <Icon.Edit />
              </span>
              <span>Suggest an edit</span>
            </div>
          </Anchor>
        </div>
      )}
    </div>
  );
});

export const onStaticGenerate: StaticGenerateHandler = () => ({
  params: Object.keys(documents).map(x => ({
    path: x
      .substring(docBase.length + 1)
      .replace(/\.md$/, "")
      .replace(/\./, "_")
      .replace(/\/index$/, ""),
  })),
});
