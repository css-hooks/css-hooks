import { Html } from "../components/html.js";
import { Head } from "../components/head.js";
import { Body } from "../components/body.js";
import { EmblemContained } from "../components/emblem.js";
import { Route } from "../route.js";

export default (): Route[] =>
  Object.entries({
    "icon-16x16.png": 16,
    "icon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
  }).map(([filename, size]) => ({
    pathname: `/icons/${filename}`,
    render: () => ({
      metadata: {
        width: size,
        height: size,
      },
      content: (
        <Html>
          <Head />
          <Body transparent>
            <EmblemContained theme="dark" size={size} />
          </Body>
        </Html>
      ),
    }),
  }));
