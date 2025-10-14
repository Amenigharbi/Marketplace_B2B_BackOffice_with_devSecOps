const withNextIntl = require("next-intl/plugin")(
  "./src/libs/next-intl/i18n.ts",
);

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",

  // Activation des métriques
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["prom-client"],
  },

  // Configuration des en-têtes CORS (ajout des endpoints métriques)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
      {
        // Autoriser l'accès aux métriques depuis Prometheus
        source: "/metrics",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.PROMETHEUS_ENDPOINT || "*",
          },
        ],
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },

  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));
