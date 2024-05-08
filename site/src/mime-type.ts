const mimeTypes: Record<string, string> = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  json: "application/json",
  png: "image/png",
  txt: "text/plain",
  webp: "image/webp",
};

export function fromPath(x: string) {
  const extension = (x.match(/\.([a-z0-9]+)$/) || [])[1];
  if (extension in mimeTypes) {
    return mimeTypes[extension];
  }
  return "application/octet-stream";
}
