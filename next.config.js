const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    // Remove if not using Server Components
    serverComponentsExternalPackages: ['mongodb'],
  },
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security: Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Security: Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Security: Enable XSS protection
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Security: Referrer policy
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          // Security: Permissions policy (disable unnecessary features)
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Security: HTTPS Strict Transport (force HTTPS)
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // CORS (keep flexible for preview/dev)
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
