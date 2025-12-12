import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security: Hide stack information
  poweredByHeader: false,

  // React Best Practice: Catch unsafe lifecycles and bad practices
  reactStrictMode: true,

  // Logging: Clean up dev console with focused fetch logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN' // Prevents clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevents MIME sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
