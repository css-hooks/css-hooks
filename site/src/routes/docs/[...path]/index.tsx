import { component$ } from "@builder.io/qwik";
import {
  type StaticGenerateHandler,
  routeLoader$,
  useLocation,
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
  if (`${docBase}/${path}/index.md` in documents) {
    return {
      isIndex: true,
      document: await Markdown.render(
        matter(await documents[`${docBase}/${path}/index.md`]()).content,
      ),
    };
  }
  if (`${docBase}/${path}.md` in documents) {
    return {
      isIndex: false,
      document: await Markdown.render(
        matter(await documents[`${docBase}/${path}.md`]()).content,
      ),
    };
  }
  return requestEvent.fail(404, {
    errorMessage: await Markdown.render(notFoundDoc),
  });
});

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
          document.value.document || document.value.errorMessage
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
