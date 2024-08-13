import withBundleAnalyzer from "@next/bundle-analyzer";
import withPlugins from "next-compose-plugins";
import withPWA from "next-pwa";
import { env } from "./env.mjs";

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins(
  [
    [
      withPWA({
        dest: "public", // destination directory for the PWA files
        disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
        register: true, // register the PWA service worker
        skipWaiting: true, // skip waiting for service worker activation
      }),
      withBundleAnalyzer({ enabled: env.ANALYZE }),
    ],
  ],
  {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "ekxb0zdvbkmwks1n.public.blob.vercel-storage.com",
          port: "",
        },
      ],
    },
    experimental: { instrumentationHook: true, missingSuspenseWithCSRBailout: false },
    output: "standalone",
    rewrites() {
      return [
        { source: "/healthz", destination: "/api/health" },
        { source: "/api/healthz", destination: "/api/health" },
        { source: "/health", destination: "/api/health" },
        { source: "/ping", destination: "/api/health" },
      ];
    },
  }
);

export default config;
