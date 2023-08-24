/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
};

const withMDX = require("@next/mdx")();
module.exports = withMDX(nextConfig);
