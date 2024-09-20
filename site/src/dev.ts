import crypto from "crypto";
import http from "http";

import * as MimeType from "./mime-type.js";
import * as Pathname from "./pathname.js";
import site from "./site.js";

const sockets: { end: () => void }[] = [];

function addLiveReload(html: string): string {
  const script = `
    <script>
      new WebSocket("ws://" + location.host).addEventListener("close", () => {
        (function reload(n) {
          fetch("/check")
            .then(({ ok }) => {
              if (ok) {
                location.reload();
              } else {
                throw new Error("Server not running");
              }
            })
            .catch(() => {
              setTimeout(() => reload(n - 1), 500);
            });
        })(10);
      });
    </script>
  `;
  if (html.includes("</body>")) {
    return html.replace("</body>", `${script}</body>`);
  }
  return html + script;
}

http
  .createServer(async (req, res) => {
    if (req.url === "/check") {
      res.writeHead(204);
      return res.end();
    }
    if (
      !req.url ||
      (!req.url.endsWith("/") &&
        (req.headers.accept?.includes("text/html") ||
          !/\.[a-z0-9]+$/.test(req.url)))
    ) {
      res.writeHead(301, { Location: `${req.url || ""}/` });
      return res.end();
    }
    const match = site.find(x => x.pathname === req.url);
    if (!match) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write(
        `Could not find a resource located at ${req.url}\n\nAvailable routes:\n${site.map(x => `- ${x.pathname}`).join("\n")}`,
      );
      return res.end();
    }
    let content: Awaited<ReturnType<typeof match.render>>["content"];
    try {
      content = (await match.render()).content;
    } catch (e) {
      console.error(e);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.write("An error occurred while processing your request.");
      return res.end();
    }
    const mimeType = MimeType.fromPath(Pathname.toRelativeFilePath(req.url));
    res.writeHead(200, { "Content-Type": mimeType });
    if (mimeType === "text/html" && typeof content === "string") {
      res.write(addLiveReload(content));
    } else if (Buffer.isBuffer(content)) {
      res.write(content);
    }
    return res.end();
  })
  .on("upgrade", ({ headers }, socket) => {
    socket.write(
      [
        "HTTP/1.1 101 Web Socket Protocol Handshake",
        "Upgrade: WebSocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${crypto
          .createHash("sha1")
          .update(
            `${headers["sec-websocket-key"]}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`,
          )
          .digest("base64")}`,
        "",
      ]
        .map(x => `${x}\r\n`)
        .join(""),
    );
    sockets.push(socket);
  })
  .listen(8080, () => {
    console.log("Listening on port 8080...");
  });

process.on("exit", () => {
  sockets.forEach(socket => {
    socket.end();
  });
  process.exit(0);
});
