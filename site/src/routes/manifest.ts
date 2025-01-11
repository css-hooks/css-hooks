import { gray } from "../design/colors.ts";

export function loader() {
  return new Response(
    JSON.stringify({
      $schema: "https://json.schemastore.org/web-manifest-combined.json",
      name: "CSS Hooks",
      short_name: "CSS Hooks",
      start_url: ".",
      display: "standalone",
      background_color: gray(90),
      description:
        "Hooks add CSS features to native inline styles, with no build steps and minimal runtime.",
      icons: [
        {
          src: "./icons/192/192/icon.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "./icons/512/512/icon.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
    }),
    {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "applicatin/json",
      },
    },
  );
}
