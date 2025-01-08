import { index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("docs", [index("routes/docs.tsx"), route("*", "routes/doc.tsx")]),
  ...prefix(
    "icons",
    prefix(":width", prefix(":height", [route("icon.png", "routes/icon.tsx")])),
  ),
  route("manifest.json", "routes/manifest.ts"),
  route("opengraph.png", "routes/opengraph.tsx"),
  route("robots.txt", "routes/robots.ts"),
];
