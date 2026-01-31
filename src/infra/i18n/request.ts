import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { config } from '@/infra/config';

/**
 * next-intl configuration
 * 
 * Handles server-side i18n setup for Next.js App Router
 */

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!config.i18n.locales.includes(locale as any)) {
    notFound();
  }

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
