# 📁 File Structure

Complete guide to the project's file structure and organization.

## 🗂️ Overview

```
nextjs-boilerplate/
├── src/                        # Source code
│   ├── app/                    # Next.js App Router (Pages & Layouts)
│   ├── bff/                    # Backend-for-Frontend layer
│   ├── features/               # Feature modules (domain logic)
│   ├── shared/                 # Shared code (components, hooks, stores)
│   ├── infra/                  # Infrastructure (config, seo, utils)
│   ├── styles/                 # Global SCSS styles
│   └── middleware.ts           # Next.js middleware
│
├── public/                     # Static assets
├── .env                        # Environment variables
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

## 📂 Detailed Structure

### `src/app/` - Next.js App Router

Next.js 13+ App Router with route groups for organization.

```
app/
├── (auth)/                     # Auth route group
│   ├── layout.tsx             # Auth layout (redirects if logged in)
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── register/
│       └── page.tsx           # Register page
│
├── (protected)/               # Protected route group (requires auth)
│   ├── layout.tsx            # Protected layout (checks auth, redirects if not)
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page
│   └── users/
│       └── page.tsx          # Users management page
│
├── layout.tsx                # Root layout (HTML, providers)
├── page.tsx                  # Home page (public)
├── home.module.scss          # Home page styles
├── not-found.tsx             # 404 page
├── robots.ts                 # Robots.txt generation
└── sitemap.ts                # Sitemap.xml generation
```

**Route Groups:**

- `(auth)` - Authentication pages (login, register)
- `(protected)` - Pages requiring authentication
- No group - Public pages

**Key Features:**

- ✅ Clean URLs (no `/en`, `/tr` prefixes)
- ✅ Server-side auth checks
- ✅ Automatic redirects (login → intended destination)
- ✅ SEO-friendly with metadata

### `src/bff/` - Backend-for-Frontend Layer

Abstraction layer between frontend and backend API.

```
bff/
├── client.ts                  # BFF fetch wrapper (handles auth, errors)
├── types.ts                   # BFF response types
├── errors.ts                  # Custom error classes
├── modules/                   # Domain-based API modules
│   ├── auth.ts               # Auth API (login, register, logout) - MOCK
│   ├── users.ts              # Users API (CRUD operations)
│   └── index.ts              # Exports all modules
└── index.ts                   # Main BFF entry point
```

**Key Features:**

- ✅ Mock authentication (ready to replace)
- ✅ Centralized error handling
- ✅ Type-safe API calls
- ✅ Auth token management
- ✅ Request/response interceptors

**Mock Auth:**
All auth calls return dummy data. To connect real backend:

1. Replace mock functions in `modules/auth.ts`
2. Update `BACKEND_API_URL` in `.env`

### `src/features/` - Feature Modules

Domain-driven feature modules with complete logic.

```
features/
├── auth/                      # Authentication feature
│   ├── components/           # Auth-specific components
│   │   ├── login-form.tsx   # Login form (client)
│   │   ├── register-form.tsx # Register form (client)
│   │   └── logout-button.tsx # Logout button (client)
│   ├── hooks/                # Auth hooks
│   │   └── use-auth.ts      # useLogin, useLogout, useSession
│   ├── lib/                  # Server-side utilities
│   │   └── server-auth.ts   # getServerSession, requireAuth, etc.
│   └── index.ts              # Public exports (client only)
│
└── users/                     # Users feature
    ├── components/
    │   ├── user-card.tsx
    │   └── users-list.tsx
    ├── hooks/
    │   └── use-users.ts
    └── index.ts
```

**Feature Structure:**

- `components/` - Feature-specific UI components
- `hooks/` - React hooks for the feature
- `lib/` - Server-side utilities (not exported in index.ts)
- `index.ts` - Public API (only client-safe exports)

**Important:**

- ❌ Never export server utilities (`lib/`) from `index.ts`
- ✅ Import server utilities directly: `@/features/auth/lib/server-auth`

### `src/shared/` - Shared Code

Reusable code used across features.

```
shared/
├── components/                # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── spinner.tsx
│   └── index.ts
│
├── hooks/                     # Custom hooks
│   ├── use-query.ts          # React Query wrappers
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   ├── use-click-outside.ts
│   ├── use-query-params.ts
│   └── index.ts
│
├── stores/                    # Zustand stores (persisted)
│   ├── auth-store.ts         # Auth hints (persisted)
│   ├── ui-store.ts           # UI state (partially persisted)
│   ├── preferences-store.ts  # User preferences (persisted)
│   └── index.ts
│
├── providers/                 # React providers
│   └── react-query-provider.tsx
│
├── constants/                 # Constants
│   └── query-keys.ts         # React Query keys
│
├── lib/                       # Utilities
│   └── server-query.tsx      # Server-side React Query
│
└── utils/                     # Utility functions
    └── index.ts
```

**Stores (Persisted with Zustand):**

- **Auth Store:** User hints, auth status → `localStorage`
- **UI Store:** Sidebar, theme, modals → Partial `localStorage`
- **Preferences Store:** Language, settings → `localStorage`

### `src/infra/` - Infrastructure

Cross-cutting concerns and configuration.

```
infra/
├── config/                    # App configuration
│   └── index.ts              # Centralized config (env vars)
│
├── seo/                       # SEO utilities
│   ├── metadata.ts           # Metadata presets
│   ├── structured-data.ts    # JSON-LD generators
│   └── index.ts
│
└── i18n/                      # i18n (legacy, can be removed)
    ├── locales/
    │   ├── en.json
    │   └── tr.json
    ├── request.ts
    └── utils.ts
```

**Configuration:**

- ✅ Centralized environment variables
- ✅ Type-safe config access
- ✅ Default values

**SEO:**

- ✅ Metadata generators for common pages
- ✅ OpenGraph support
- ✅ Structured data (JSON-LD)

### `src/styles/` - Global SCSS

Modern SCSS with variables, mixins, and modules.

```
styles/
├── globals.scss               # Global styles
├── _variables.scss            # SCSS variables (colors, spacing, etc.)
└── _mixins.scss               # SCSS mixins (responsive, utilities)
```

**Key Features:**

- ✅ Modern `@use` syntax (not `@import`)
- ✅ Auto-imported in all SCSS files (via `prependData`)
- ✅ Path aliases (`@/styles/`)
- ✅ Responsive breakpoint mixins

**Example:**

```scss
// No need to import - auto-injected!
.my-component {
  color: $color-primary;
  padding: $spacing-md;

  @include md {
    padding: $spacing-lg;
  }
}
```

### `src/middleware.ts` - Next.js Middleware

```typescript
middleware.ts                  # Request interceptor
```

**Current Features:**

- ✅ Adds `x-pathname` header for protected route handling
- ✅ Available for extending (rate limiting, logging, etc.)

## 📦 Root Files

### Configuration Files

```
.env                           # Environment variables (create manually)
next.config.js                 # Next.js configuration
tsconfig.json                  # TypeScript configuration
package.json                   # Dependencies and scripts
.gitignore                     # Git ignore rules
```

### Documentation

```
README.md                      # Main documentation
ARCHITECTURE.md                # Architecture overview
FILE_STRUCTURE.md              # This file
QUICKSTART.md                  # Quick start guide
```

## 🎯 Path Aliases

Configured in `tsconfig.json`:

```typescript
import { Button } from '@/shared/components'; // shared/components
import { api } from '@/bff'; // bff/index.ts
import { useAuth } from '@/features/auth'; // features/auth/index.ts
import { config } from '@/infra/config'; // infra/config/index.ts
import '@/styles/globals.scss'; // styles/globals.scss
```

**Available Aliases:**

- `@/app/*` → `src/app/*`
- `@/bff/*` → `src/bff/*`
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`
- `@/infra/*` → `src/infra/*`
- `@/styles/*` → `src/styles/*`

## 🚀 Adding New Features

### 1. Create Feature Module

```bash
mkdir -p src/features/my-feature/{components,hooks,lib}
```

### 2. Structure

```
features/my-feature/
├── components/
│   └── my-component.tsx
├── hooks/
│   └── use-my-feature.ts
├── lib/                       # Optional: server-side only
│   └── server-utils.ts
└── index.ts                   # Export client-safe code only
```

### 3. Add BFF Module (if needed)

```typescript
// src/bff/modules/my-feature.ts
export const myFeatureApi = {
  getData: async () => {
    /* ... */
  },
};
```

### 4. Use in Pages

```typescript
// src/app/my-page/page.tsx
import { MyComponent } from '@/features/my-feature';
```

## 📝 File Naming Conventions

- **Pages:** `page.tsx`
- **Layouts:** `layout.tsx`
- **Components:** `kebab-case.tsx` (e.g., `login-form.tsx`)
- **Hooks:** `use-*.ts` (e.g., `use-auth.ts`)
- **Utils:** `kebab-case.ts` (e.g., `format-date.ts`)
- **Types:** `types.ts` or `*.types.ts`
- **SCSS Modules:** `*.module.scss`
- **Global SCSS:** `*.scss`

## 🔒 Protected vs Public Files

### Server-Only Files

These should NEVER be imported in client components:

```
✅ src/features/*/lib/          # Server utilities
✅ src/shared/lib/              # Server utilities
❌ Never export these in index.ts!
```

### Client-Safe Files

Can be used anywhere:

```
✅ src/features/*/components/   # UI components
✅ src/features/*/hooks/        # React hooks
✅ src/shared/components/       # Shared UI
✅ src/shared/hooks/            # Custom hooks
✅ src/shared/stores/           # Zustand stores
```

## 🎨 Styling Structure

### CSS Modules (Component-Specific)

```scss
// home.module.scss
.hero {
  padding: $spacing-xl;
}
```

### Global Styles

```scss
// globals.scss
body {
  font-family: $font-family-base;
}
```

### Variables & Mixins (Auto-Imported)

```scss
// _variables.scss - Colors, spacing, etc.
// _mixins.scss - Responsive, utilities
```

---

**This structure is designed for scalability, maintainability, and developer experience.** 🚀
