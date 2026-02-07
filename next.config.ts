import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Add security headers - SELECTIVE blocking for Teams/About pages only
  async headers() {
    return [
      {
        // General security headers for ALL routes (does NOT block SEO)
        source: '/:path*',
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
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // ONLY block Teams page from search indexing
        source: '/teams/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
          },
        ],
      },
      {
        // ONLY block About page from search indexing (if it contains executive info)
        source: '/about/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
          },
        ],
      },
      {
        // Allow homepage to be indexed (explicitly enable SEO)
        source: '/',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      {
        // Allow other pages to be indexed for SEO
        source: '/projects/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      {
        // Allow ventures to be indexed
        source: '/ventures/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      // Add more routes you want indexed for SEO
    ];
  },

  // Webpack configuration to remove source maps in production
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Remove source maps in production to prevent code inspection
      config.devtool = false;
    }
    return config;
  },

  // Disable X-Powered-By header (security best practice)
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Environment variables for additional control
  env: {
    // Set to 'false' in production to completely hide executive data
    NEXT_PUBLIC_SHOW_EXECUTIVES: process.env.NEXT_PUBLIC_SHOW_EXECUTIVES || 'true',
  },
};

export default nextConfig;

/* 
 * SEO CONFIGURATION NOTES:
 * 
 * This configuration allows your entire website to be indexed for SEO,
 * EXCEPT for the /teams and /about pages which contain executive information.
 * 
 * INDEXED (Good for SEO):
 * ✅ Homepage (/)
 * ✅ Projects (/projects)
 * ✅ Ventures (/ventures)
 * ✅ Blog (/blog)
 * ✅ Contact (/contact)
 * ✅ All other pages not explicitly blocked
 * 
 * BLOCKED (Protected from search engines):
 * ❌ Teams page (/teams)
 * ❌ About page (/about)
 * 
 * ADDITIONAL SEO RECOMMENDATIONS:
 * 
 * 1. Create a sitemap.xml in /public/sitemap.xml
 * 2. Add proper meta tags to pages you want indexed:
 *    <meta name="description" content="Your page description" />
 *    <meta name="robots" content="index, follow" />
 * 
 * 3. Submit sitemap to Google Search Console
 * 4. Use Next.js Metadata API for SEO optimization
 */