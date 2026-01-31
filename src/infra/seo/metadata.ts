import { config } from '@/infra/config';
import type { Metadata } from 'next';

/**
 * SEO Metadata Utilities
 */

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generate metadata for pages
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = 'website',
  noIndex = false,
  canonical,
}: SEOConfig): Metadata {
  const siteTitle = 'Your App';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'A production-ready Next.js boilerplate with best practices';
  const finalDescription = description || defaultDescription;

  const metadata: Metadata = {
    title: fullTitle,
    description: finalDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    
    // Robots
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    
    // Open Graph
    openGraph: {
      type: ogType,
      title: fullTitle,
      description: finalDescription,
      url: config.app.url,
      siteName: siteTitle,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: fullTitle,
            },
          ]
        : undefined,
      locale: 'tr_TR',
      alternateLocale: ['en_US'],
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    
    // Canonical URL
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
  };

  return metadata;
}

/**
 * Generate metadata for dynamic routes
 */
export function generateDynamicMetadata({
  title,
  description,
  keywords,
  ogImage,
  path,
}: SEOConfig & { path: string }): Metadata {
  return generateMetadata({
    title,
    description,
    keywords,
    ogImage,
    canonical: `${config.app.url}${path}`,
  });
}

/**
 * Common metadata presets
 */
export const metadataPresets = {
  home: (): Metadata =>
    generateMetadata({
      title: 'Home',
      description: 'Welcome to our application - A production-ready Next.js boilerplate',
      keywords: ['nextjs', 'react', 'typescript', 'boilerplate'],
    }),

  dashboard: (): Metadata =>
    generateMetadata({
      title: 'Dashboard',
      description: 'Your personal dashboard',
      noIndex: true, // Private page
    }),

  login: (): Metadata =>
    generateMetadata({
      title: 'Login',
      description: 'Login to your account',
      noIndex: true, // Auth pages usually shouldn't be indexed
    }),

  users: (): Metadata =>
    generateMetadata({
      title: 'Users',
      description: 'Browse and manage users',
    }),

  notFound: (): Metadata =>
    generateMetadata({
      title: '404 - Page Not Found',
      description: 'The page you are looking for does not exist',
      noIndex: true,
    }),
};
