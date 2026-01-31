import { config } from '@/infra/config';

/**
 * i18n utilities
 */

export const locales = config.i18n.locales;
export const defaultLocale = config.i18n.defaultLocale;

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && locales.includes(firstSegment)) {
    return firstSegment;
  }
  
  return defaultLocale;
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  
  if (pathname.startsWith(`/${locale}`)) {
    return pathname.slice(locale.length + 1) || '/';
  }
  
  return pathname;
}

/**
 * Add locale to pathname
 */
export function addLocaleToPathname(pathname: string, locale: string): string {
  const cleanPath = removeLocaleFromPathname(pathname);
  return `/${locale}${cleanPath}`;
}

/**
 * Get alternate language links (for SEO)
 */
export function getAlternateLinks(pathname: string) {
  const cleanPath = removeLocaleFromPathname(pathname);
  
  return locales.map((locale) => ({
    locale,
    href: `/${locale}${cleanPath}`,
  }));
}
