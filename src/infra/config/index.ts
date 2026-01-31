/**
 * Infrastructure configuration and environment variables
 */

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Boilerplate',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },

  backend: {
    apiUrl: process.env.BACKEND_API_URL || 'https://api.your-backend.com',
    timeout: parseInt(process.env.BACKEND_API_TIMEOUT || '30000', 10),
  },

  api: {
    baseUrl: process.env.BACKEND_API_URL || 'https://api.your-backend.com',
  },

  session: {
    cookieName: process.env.SESSION_COOKIE_NAME || 'app_session',
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },

  i18n: {
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
    locales: (process.env.NEXT_PUBLIC_LOCALES || 'en,tr').split(','),
  },

  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableErrorTracking: process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true',
  },
} as const;

export type Config = typeof config;
