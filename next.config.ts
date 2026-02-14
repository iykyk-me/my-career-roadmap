import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'my-career-roadmap';

const nextConfig: NextConfig = {
  output: 'export',
  // This project is configured for GitHub Pages deployment. Ensure the repository name matches 'my-career-roadmap' or update next.config.ts.
  basePath: isProd ? `/${repoName}` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
