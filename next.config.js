/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // typedRoutes moved out of experimental in Next.js 15+
  typedRoutes: true,

  // SASS options for path aliases
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    prependData: `@use "@/styles/_variables.scss" as *; @use "@/styles/_mixins.scss" as *;`,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
