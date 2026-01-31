import type { MetadataRoute } from 'next';
import { config } from '@/infra/config';

/**
 * Sitemap configuration
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.app.url;
  const locales = config.i18n.locales;

  // Generate URLs for each locale
  const routes = ['/', '/about', '/contact'];
  
  const sitemap: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '/' ? 1.0 : 0.8,
      });
    });
  });

  return sitemap;
}
