export function toRelativeFilePath(pathname: string) {
  if (pathname.endsWith("/")) {
    return `${pathname}index.html`;
  }
  if (!/\.[a-z0-9]+$/.test(pathname)) {
    return `${pathname}/index.html`;
  }
  return pathname;
}
