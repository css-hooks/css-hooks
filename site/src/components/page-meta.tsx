export function PageMeta({
  description,
  pathname,
  title,
}: {
  description?: string;
  pathname: string;
  title?: string;
}) {
  const siteName = "CSS Hooks";
  const baseUrl = process.env["WEBSITE_BASE_URL"] || "http://localhost:8080";
  const url = [baseUrl, pathname].join("");
  return (
    <>
      <title>
        {`${title ? `${title} — ` : ""}`}
        {siteName}
      </title>
      <link rel="manifest" href="/manifest.json" />
      <link rel="canonical" href={url} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/icon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/icon-16x16.png"
      />
      <meta name="description" content={description} />
      <meta property="og:image" content={`${baseUrl}/opengraph.png`} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="twitter:creator" content="agilecoder" />
      <meta property="twitter:site" content="csshooks" />
      <meta property="twitter:image" content={`${baseUrl}/opengraph.png`} />
      <meta property="twitter:title" content={title || siteName} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:card" content="summary_large_image" />
    </>
  );
}
