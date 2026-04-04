import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  // pdfjs-dist: canvas is not needed (client-side text extraction only)
  turbopack: {
    resolveAlias: {
      canvas: "./src/lib/empty-module.ts",
    },
  },
};

export default nextConfig;
