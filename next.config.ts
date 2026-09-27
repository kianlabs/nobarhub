import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ['100.123.112.42'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      const ignored = config.watchOptions?.ignored;
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          ...(Array.isArray(ignored) ? ignored : ignored ? [ignored] : []),
          '**/public/sw.js',
          '**/public/sw.js.map',
          '**/public/workbox-*.js'
        ].filter(item => typeof item === 'string' && item.length > 0),
      };
    }
    return config;
  },
};

export default withSerwist(nextConfig);
