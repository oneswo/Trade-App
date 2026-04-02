import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-bd1fc69a41324eb6ba14ef6deedc2540.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'm.heavox.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
