import type { MetadataRoute } from 'next';
import { config } from '@/infra/config';

/**
 * Robots.txt configuration
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = config.app.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
