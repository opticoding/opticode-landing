import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static files in `out/`. The Worker has no image optimizer.
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
