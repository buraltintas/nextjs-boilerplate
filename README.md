# Next.js Production-Ready Boilerplate

A modern, scalable, and production-ready Next.js boilerplate with best practices and a clean architecture.

## 🚀 Features

### Core Stack

- ⚡ **Next.js 16.1.6** - Latest stable version with App Router
- ⚛️ **React 19.0.0** - Latest React with Server Components
- 🔷 **TypeScript** - Strict mode for type safety
- 🎨 **SCSS** - Modern CSS with variables, mixins, and modules
- 📦 **Webpack** - Stable bundler (Turbopack disabled for production stability)

### Architecture

- 🏗️ **Domain-Driven Design** - Clean separation of concerns
- 🔌 **BFF Pattern** - Backend-for-Frontend layer
- 📁 **Feature-Based Structure** - Modular and scalable
- 🎯 **Route Groups** - Organized routing with `(auth)`, `(protected)`, `(public)`

### State Management

- 🔄 **React Query (TanStack Query)** - Server state management with SSR
- 🗃️ **Zustand** - Client state with localStorage persistence
- 💾 **Persistent Stores** - Auth hints, preferences, and UI state

### Authentication & Routing

- 🔐 **Mock Auth System** - Ready-to-replace dummy authentication
- 🍪 **Cookie-Based Sessions** - HttpOnly cookies for security
- 🛡️ **Protected Routes** - Server-side auth checks
- 🔄 **Smart Redirects** - Post-login redirect to intended destination
- 🚪 **Auth Flow** - Login → Remember destination → Redirect back

### Development Experience

- 🎨 **Modern SCSS** - `@use` syntax, path aliases (`@/styles`)
- 📝 **Path Aliases** - Clean imports with `@/app`, `@/bff`, `@/features`, etc.
- 🔍 **Type Safety** - Strict TypeScript everywhere
- 🧩 **Reusable Components** - Shared UI component library
- 🪝 **Custom Hooks** - Reusable logic patterns

### SEO & Performance

- 🔍 **SEO Optimized** - Metadata API, OpenGraph tags
- 🗺️ **Sitemap & Robots.txt** - Automatic generation
- 📊 **Structured Data** - JSON-LD support
- ⚡ **SSR Ready** - Server-side rendering by default

## 📦 Project Structure

```
nextjs-boilerplate/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/       # Protected routes (require auth)
│   │   │   ├── dashboard/
│   │   │   └── users/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── not-found.tsx      # 404 page
│   │
│   ├── bff/                   # Backend-for-Frontend layer
│   │   ├── client.ts          # BFF fetch wrapper
│   │   ├── modules/           # API modules
│   │   │   ├── auth.ts        # Auth API (mock)
│   │   │   └── users.ts       # Users API
│   │   ├── errors.ts          # Custom errors
│   │   └── types.ts           # BFF types
│   │
│   ├── features/              # Feature modules
│   │   ├── auth/              # Auth feature
│   │   │   ├── components/    # Login/Register forms
│   │   │   ├── hooks/         # Auth hooks
│   │   │   └── lib/           # Server-side auth utils
│   │   └── users/             # Users feature
│   │
│   ├── shared/                # Shared code
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom hooks
│   │   ├── stores/            # Zustand stores (persisted)
│   │   ├── providers/         # React providers
│   │   └── utils/             # Utility functions
│   │
│   ├── infra/                 # Infrastructure
│   │   ├── config/            # App configuration
│   │   ├── seo/               # SEO utilities
│   │   └── i18n/              # i18n setup (legacy)
│   │
│   ├── styles/                # Global SCSS
│   │   ├── globals.scss       # Global styles
│   │   ├── _variables.scss    # SCSS variables
│   │   └── _mixins.scss       # SCSS mixins
│   │
│   └── middleware.ts          # Next.js middleware
│
├── .env                       # Environment variables
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.9.0 (use `nvm use 24` for latest)
- npm or yarn

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Create `.env` file:**

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API (mock for now)
BACKEND_API_URL=http://localhost:4000/api

# Session Configuration
SESSION_COOKIE_NAME=session
SESSION_SECRET=your-secret-key-here-change-in-production
```

3. **Run development server:**

```bash
npm run dev
```

4. **Open browser:**

```
http://localhost:3000
```

## 🔐 Authentication Flow

The boilerplate includes a complete mock authentication system:

### Features

- ✅ Login with any email/password (mock)
- ✅ Register with any details (mock)
- ✅ Cookie-based session management
- ✅ Protected routes with server-side checks
- ✅ Post-login redirect to intended destination
- ✅ Logout clears session and redirects to home

### Flow Example

1. **Access protected route without auth:**

```
GET /dashboard → Redirect to /login?redirectTo=%2Fdashboard
```

2. **Login:**

```
Submit login form → Mock token saved to cookie → Redirect to /dashboard
```

3. **Logout:**

```
Click logout → Clear cookie → Redirect to /
```

### Replacing Mock Auth

To connect to a real backend:

1. Update `src/bff/modules/auth.ts` to call real API
2. Update `src/features/auth/lib/server-auth.ts` for real session validation
3. Configure `BACKEND_API_URL` in `.env`

## 🗃️ State Management

### React Query (Server State)

```typescript
import { useBFFQuery } from '@/shared/hooks/use-query';

// Fetch data with SSR support
const { data, isLoading } = useBFFQuery(queryKeys.users.list(), () =>
  api.users.getAll()
);
```

### Zustand (Client State)

```typescript
import { useAuthStore } from '@/shared/stores';

// Persisted to localStorage
const { userHint, setUserHint } = useAuthStore();
```

### Available Stores

- **Auth Store** - User hints, auth status (persisted)
- **Preferences Store** - User preferences, language (persisted)
- **UI Store** - Sidebar, theme, modals (partially persisted)

## 🎨 Styling

### SCSS with Modern Syntax

```scss
// Automatic imports (via prependData)
.my-component {
  color: $color-primary;

  @include md {
    padding: $spacing-lg;
  }
}
```

### Path Aliases

```scss
// Import from anywhere
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;
```

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server (Webpack)

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript checks
```

## 🔧 Configuration

### Path Aliases (tsconfig.json)

```json
{
  "@/app/*": ["./src/app/*"],
  "@/bff/*": ["./src/bff/*"],
  "@/features/*": ["./src/features/*"],
  "@/shared/*": ["./src/shared/*"],
  "@/infra/*": ["./src/infra/*"],
  "@/styles/*": ["./src/styles/*"]
}
```

### SCSS Auto-imports (next.config.js)

```javascript
sassOptions: {
  prependData: `@use "@/styles/_variables.scss" as *; @use "@/styles/_mixins.scss" as *;`;
}
```

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture overview
- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - Complete file structure guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Step-by-step quick start

## 🛠️ Tech Stack

### Core

- Next.js 16.1.6
- React 19.0.0
- TypeScript 5.7.2

### Data & State

- @tanstack/react-query 5.90.20
- zustand 5.0.10

### Styling

- SASS 1.97.3

### Utils

- clsx 2.1.1

## 🚀 Production Deployment

1. **Build the project:**

```bash
npm run build
```

2. **Set environment variables:**

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
BACKEND_API_URL=https://api.yourdomain.com
SESSION_SECRET=strong-random-secret
NODE_ENV=production
```

3. **Deploy to Vercel, Netlify, or your platform**

## 🔄 Migration Notes

### From Previous Version

If upgrading from a locale-based version:

- ✅ `[locale]` routes removed - now flat structure
- ✅ No URL prefixes (`/en`, `/tr`) - clean URLs
- ✅ `next-intl` removed - simplified architecture
- ✅ Turbopack disabled - using Webpack for stability

## 📄 License

MIT License - feel free to use this boilerplate for your projects!

## 🤝 Contributing

Contributions are welcome! This is a production-ready boilerplate designed for real-world projects.

## 🎯 Next Steps

1. Replace mock auth with real backend
2. Add more features to your app
3. Customize styling and branding
4. Deploy to production!

---

**Built with ❤️ for modern Next.js development**
