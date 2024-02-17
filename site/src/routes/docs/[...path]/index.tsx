import { component$ } from "@builder.io/qwik";
import {
  type StaticGenerateHandler,
  routeLoader$,
  useLocation,
  type DocumentHead,
  z,
} from "@builder.io/qwik-city";
import matter from "gray-matter";
import * as Markdown from "~/markdown";

const documents = import.meta.glob("../../../../../docs/**/*.md", {
  import: "default",
  as: "raw",
  eager: false,
});

const docBase = "../../../../../docs";

const notFoundDoc = `
# Not found

The requested document does not exist.

Please proceed to the [Documentation](/docs) homepage so we can help you find what you're looking for.
`;

export const useDocument = routeLoader$(async requestEvent => {
  const {
    params: { path },
  } = requestEvent;
  const indexPath = `${docBase}/${path}/index.md`;
  const altPath = `${docBase}/${path}.md`;
  if (indexPath in documents || altPath in documents) {
    const isIndex = indexPath in documents;
    const markdown = matter(await documents[isIndex ? indexPath : altPath]());
    return {
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
    <>
      {document.value.isIndex ? undefined : (
        <base href={location.url.toString().replace(/\/$/, "")} />
      )}
      <div
        dangerouslySetInnerHTML={
          document.value.content || document.value.errorMessage
        }
      />
    </>
  );
});

export const onStaticGenerate: StaticGenerateHandler = () => ({
  params: Object.keys(documents).map(x => ({
    path: x
      .substring(docBase.length + 1)
      .replace(/\.md$/, "")
      .replace(/\/index$/, ""),
  })),
});
