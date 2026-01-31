/**
 * Infrastructure configuration and environment variables
 */

export const config = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },

  backend: {
    apiUrl: process.env.BACKEND_API_URL || 'https://api.your-backend.com',
    timeout: parseInt(process.env.BACKEND_API_TIMEOUT || '30000', 10),
  },

  session: {
    cookieName: process.env.SESSION_COOKIE_NAME || 'app_session',
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
  },

  i18n: {
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
    locales: (process.env.NEXT_PUBLIC_LOCALES || 'en,tr').split(','),
  },
} as const;

export type Config = typeof config;
