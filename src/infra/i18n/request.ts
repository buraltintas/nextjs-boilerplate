import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { config } from '@/infra/config';

/**
 * next-intl configuration
 * 
 * Handles server-side i18n setup for Next.js App Router
 */

export default getRequestConfig(async ({ locale }) => {
  // Locale from params - ensure it's a string
  const currentLocale = locale || config.i18n.defaultLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!config.i18n.locales.includes(currentLocale as any)) {
    notFound();
  }

  return {
    locale: currentLocale,
    messages: (await import(`./locales/${currentLocale}.json`)).default,
  };
});
