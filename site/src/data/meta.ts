import type { MetaDescriptors } from "react-router/route-module";

const baseURL = "https://css-hooks.com";

const url = (pathname: string) =>
  URL.canParse(pathname, baseURL)
    ? new URL(pathname, baseURL).toString()
    : undefined;

type CreateMetaDescriptorArgs = {
  title?: string;
  description: string;
  image?: string | undefined;
};

export const createMetaDescriptors =
  <Args extends { location: { pathname: string } }>(
    argsIn:
      | CreateMetaDescriptorArgs
      | ((args: Args) => CreateMetaDescriptorArgs),
  ): ((args: Args) => MetaDescriptors) =>
  (args: Args) => {
    const defaultImage = "/opengraph.png";
    const {
      location: { pathname },
    } = args;
    const go = ({
      title,
      description,
      image,
    }: CreateMetaDescriptorArgs): MetaDescriptors => [
      { title: `${title ? `${title} — ` : ""}CSS Hooks` },
      { property: "og:title", content: title || "CSS Hooks" },
      { property: "og:image", content: url(image || defaultImage) },
      { property: "og:url", content: url(pathname) },
      { property: "og:site_name", content: "CSS Hooks" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: url(image || defaultImage) },
      { name: "twitter:creator", content: "agilecoder" },
      { name: "twitter:title", content: title || "CSS Hooks" },
      { name: "description", content: description },
    ];
    return typeof argsIn === "function" ? go(argsIn(args)) : go(argsIn);
  };
