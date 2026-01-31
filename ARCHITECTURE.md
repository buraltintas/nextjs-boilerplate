# 🏗️ Architecture Documentation

Comprehensive guide to the project's architecture, design decisions, and patterns.

## 📐 Architecture Overview

This boilerplate follows a **Domain-Driven Design (DDD)** approach with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│                 (app/ - Next.js Pages)                  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                    Feature Layer                         │
│           (features/ - Domain Logic)                    │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                    BFF Layer                             │
│          (bff/ - API Abstraction)                       │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                  Backend API                             │
│            (External Service - Mock)                    │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Core Principles

### 1. **Separation of Concerns**

Each layer has a single, well-defined responsibility:

- **App Layer**: Routing and rendering
- **Features**: Domain logic and business rules
- **BFF**: API communication and data transformation
- **Shared**: Reusable, domain-agnostic code

### 2. **Backend-for-Frontend (BFF) Pattern**

All backend communication goes through the BFF layer:

- ✅ Centralized error handling
- ✅ Authentication token management
- ✅ Request/response transformation
- ✅ Type-safe API calls
- ✅ Easy to mock for development

### 3. **Feature-Based Organization**

Code is organized by feature, not by technical role:

```
features/auth/              # Everything auth-related
  ├── components/          # Auth UI
  ├── hooks/               # Auth hooks
  └── lib/                 # Auth utilities
```

### 4. **Server-First Architecture**

Leverages Next.js Server Components:

- ✅ Server-side data fetching
- ✅ Server-side authentication checks
- ✅ Reduced client bundle size
- ✅ Better SEO

### 5. **Type Safety**

TypeScript strict mode throughout:

- ✅ No implicit any
- ✅ Strict null checks
- ✅ Type-safe API calls
- ✅ Type-safe routing

## 📂 Layer Details

### 🎨 Presentation Layer (`app/`)

**Responsibility:** Routing, rendering, and layout

**Key Patterns:**

- **Route Groups** for organization
- **Server Components** by default
- **Client Components** when needed (`'use client'`)
- **Layouts** for shared UI

**Route Groups:**

```
(auth)/       → Authentication pages (redirects if logged in)
(protected)/  → Protected pages (redirects if not logged in)
(no group)    → Public pages
```

**Authentication Flow:**

```typescript
// Protected Layout (Server Component)
export default async function ProtectedLayout({ children }) {
  const user = await getServerSession();

  if (!user) {
    // Get intended destination
    const pathname = headers().get('x-pathname');
    redirect(`/login?redirectTo=${pathname}`);
  }

  return <div>{children}</div>;
}
```

### 🎯 Feature Layer (`features/`)

**Responsibility:** Domain logic and business rules

**Structure:**

```
features/{feature-name}/
├── components/     # Feature-specific UI components
├── hooks/          # React hooks for the feature
├── lib/            # Server-side utilities (NOT exported)
└── index.ts        # Public API (client-safe exports only)
```

**Key Patterns:**

- **Encapsulation**: Everything related to a feature stays in its folder
- **Public API**: Only export what's needed (`index.ts`)
- **Server Isolation**: Server utilities in `lib/`, never exported

**Example (Auth Feature):**

```typescript
// features/auth/hooks/use-auth.ts (Client)
export function useLogin() {
  return useBFFMutation(
    async (credentials) => {
      const response = await api.auth.login(credentials);

      // Store token in cookie
      document.cookie = `session=${response.data.token}; ...`;

      return response;
    }
  );
}

// features/auth/lib/server-auth.ts (Server)
export async function getServerSession(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;

  // Mock: return dummy user
  return { id: '1', name: 'John Doe', ... };
}
```

### 🔌 BFF Layer (`bff/`)

**Responsibility:** API communication and data transformation

**Structure:**

```
bff/
├── client.ts       # Fetch wrapper with auth & error handling
├── types.ts        # Response types
├── errors.ts       # Custom error classes
└── modules/        # Domain-based API modules
    ├── auth.ts     # Auth API (mock)
    └── users.ts    # Users API
```

**Key Features:**

- **Type-Safe**: All responses typed
- **Error Handling**: Centralized
- **Auth Management**: Automatic token attachment
- **Mocking**: Easy to replace with real API

**Current Implementation (Mock):**

```typescript
// bff/modules/auth.ts
export const authApi = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data
    return {
      data: {
        user: { id: '1', name: 'John Doe', ... },
        token: 'mock-jwt-token-' + Date.now(),
      },
      error: null,
    };
  },
};
```

**Real Implementation (when ready):**

```typescript
// bff/modules/auth.ts
import { bffClient } from '../client';

export const authApi = {
  login: async (credentials) => {
    return bffClient.post('/auth/login', credentials);
  },
};
```

### 🤝 Shared Layer (`shared/`)

**Responsibility:** Reusable, domain-agnostic code

**Structure:**

```
shared/
├── components/     # UI components (Button, Card, Input, etc.)
├── hooks/          # Reusable hooks (useDebounce, useMediaQuery, etc.)
├── stores/         # Zustand stores with persistence
├── providers/      # React providers (React Query, etc.)
├── constants/      # Constants (query keys, etc.)
└── utils/          # Utility functions
```

**Key Patterns:**

- **Framework-Agnostic**: Components have no business logic
- **Composable**: Small, focused utilities
- **Persistent Stores**: Zustand with localStorage

**Stores (Persisted):**

```typescript
// shared/stores/auth-store.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userHint: null,
      isAuthenticatedHint: false,
      setUserHint: (user) => set({ userHint: user }),
      clearAuth: () => set({ userHint: null, isAuthenticatedHint: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### ⚙️ Infrastructure Layer (`infra/`)

**Responsibility:** Cross-cutting concerns

**Structure:**

```
infra/
├── config/         # Centralized configuration
├── seo/            # SEO utilities (metadata, structured data)
└── i18n/           # i18n setup (legacy, can be removed)
```

**Configuration:**

```typescript
// infra/config/index.ts
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Boilerplate',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
  api: {
    baseUrl: process.env.BACKEND_API_URL || 'http://localhost:4000/api',
  },
  session: {
    cookieName: process.env.SESSION_COOKIE_NAME || 'session',
    secret: process.env.SESSION_SECRET || 'default-secret',
  },
};
```

## 🔐 Authentication Architecture

### Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Browser    │─────▶│   Server    │─────▶│   Cookie    │
│  (Client)   │      │  Component  │      │   Storage   │
└─────────────┘      └─────────────┘      └─────────────┘
      │                     │                     │
      │ 1. Login Request    │                     │
      │────────────────────▶│                     │
      │                     │                     │
      │                     │ 2. Mock Auth OK     │
      │                     │────────────────────▶│
      │                     │                     │
      │ 3. Set Cookie       │                     │
      │◀────────────────────────────────────────────
      │                     │                     │
      │ 4. Redirect to      │                     │
      │    Dashboard        │                     │
      │◀────────────────────│                     │
      │                     │                     │
      │ 5. GET /dashboard   │                     │
      │────────────────────▶│                     │
      │                     │                     │
      │                     │ 6. Read Cookie      │
      │                     │◀────────────────────│
      │                     │                     │
      │                     │ 7. Valid? Yes       │
      │                     │                     │
      │ 8. Render Dashboard │                     │
      │◀────────────────────│                     │
└─────────────────────────────────────────────────────────┘
```

### Components

**1. Client-Side Auth (`features/auth/hooks/use-auth.ts`)**

```typescript
export function useLogin() {
  return useBFFMutation(async (credentials) => {
    const response = await api.auth.login(credentials);

    // Store token in cookie
    if (response.data) {
      document.cookie = `session=${response.data.token}; path=/; max-age=86400; samesite=lax`;
    }

    return response;
  });
}
```

**2. Server-Side Auth (`features/auth/lib/server-auth.ts`)**

```typescript
export async function getServerSession(): Promise<User | null> {
  const token = await getSessionToken();

  if (!token) return null;

  // Mock: Return dummy user
  return {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  };
}
```

**3. Protected Routes (`app/(protected)/layout.tsx`)**

```typescript
export default async function ProtectedLayout({ children }) {
  const user = await getServerSession();

  if (!user) {
    const pathname = headers().get('x-pathname') || '/dashboard';
    redirect(`/login?redirectTo=${encodeURIComponent(pathname)}`);
  }

  return <div>{children}</div>;
}
```

**4. Post-Login Redirect (`app/(auth)/login/page.tsx`)**

```typescript
export default function LoginPage({ searchParams }) {
  const redirectTo = searchParams.redirectTo || '/dashboard';

  return <LoginForm redirectTo={redirectTo} />;
}
```

### Flow Examples

**Protected Route Access (Not Logged In):**

```
1. User → GET /dashboard
2. Server → Check session cookie → Not found
3. Server → Get pathname from middleware → /dashboard
4. Server → Redirect → /login?redirectTo=%2Fdashboard
5. User → See login page
6. User → Submit credentials
7. Client → Call api.auth.login()
8. Client → Set cookie with token
9. Client → router.push(redirectTo) → /dashboard
10. Server → Check session cookie → Found!
11. Server → Render dashboard
```

**Logout:**

```
1. User → Click logout button
2. Client → Call api.auth.logout()
3. Client → Clear cookie: document.cookie = 'session=; max-age=0'
4. Client → Clear Zustand store
5. Client → router.push('/') → Home
```

## 🗃️ State Management Architecture

### Two-Tier State System

**1. Server State (React Query)**

- API data
- Cached responses
- Mutations
- Background refetching

**2. Client State (Zustand)**

- UI state (sidebar, modals)
- User preferences
- Auth hints (optimistic UI)

### React Query Setup

**Provider:**

```typescript
// shared/providers/react-query-provider.tsx
export function ReactQueryProvider({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

**Usage:**

```typescript
// features/auth/hooks/use-auth.ts
export function useSession() {
  return useBFFQuery(
    queryKeys.auth.session(),
    () => api.auth.getCurrentUser(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    }
  );
}
```

### Zustand Stores

**Auth Store (Persisted):**

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userHint: null,
      isAuthenticatedHint: false,
      setUserHint: (user) => set({ userHint: user }),
      clearAuth: () =>
        set({
          userHint: null,
          isAuthenticatedHint: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

**Why Both?**

- **React Query**: Server data with caching
- **Zustand**: Optimistic UI hints (prevent layout shifts)

## 🎨 Styling Architecture

### SCSS with Modern Syntax

**Structure:**

```
styles/
├── globals.scss        # Global styles
├── _variables.scss     # Variables (colors, spacing, etc.)
└── _mixins.scss        # Mixins (responsive, utilities)
```

**Auto-Import via `prependData`:**

```javascript
// next.config.js
sassOptions: {
  prependData: `@use "@/styles/_variables.scss" as *; @use "@/styles/_mixins.scss" as *;`;
}
```

**Usage:**

```scss
// No imports needed!
.my-component {
  color: $color-primary;
  padding: $spacing-md;

  @include md {
    padding: $spacing-lg;
  }
}
```

**CSS Modules:**

```scss
// home.module.scss
.hero {
  background: $color-gradient-primary;

  @include lg {
    height: 80vh;
  }
}
```

## 🚦 Routing Architecture

### Route Groups

```
app/
├── (auth)/             # Auth pages
│   ├── layout.tsx     # Redirects if logged in
│   ├── login/
│   └── register/
│
├── (protected)/       # Protected pages
│   ├── layout.tsx    # Requires auth, redirects if not
│   ├── dashboard/
│   └── users/
│
├── layout.tsx        # Root layout
└── page.tsx          # Public home page
```

### URL Structure

```
/                     → Public home
/login                → Login (auth group)
/register             → Register (auth group)
/dashboard            → Dashboard (protected)
/users                → Users (protected)
```

**No locale prefixes** - clean URLs!

## 🔄 Data Flow

### Typical Request Flow

```
1. User Action (Click Button)
   ↓
2. React Hook (useLogin)
   ↓
3. BFF Module (api.auth.login)
   ↓
4. Mock API Response
   ↓
5. Cookie Set (document.cookie)
   ↓
6. Store Update (Zustand)
   ↓
7. React Query Cache Update
   ↓
8. UI Re-render
   ↓
9. Redirect (router.push)
```

### Server Component Data Flow

```
1. Server Component Renders
   ↓
2. Call Server Function (getServerSession)
   ↓
3. Read Cookie (cookies())
   ↓
4. Mock Validation
   ↓
5. Return User Data
   ↓
6. Render with Data
   ↓
7. Send to Client
```

## 🛠️ Middleware Architecture

**Purpose:** Add custom headers, handle requests

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Add pathname for protected route handling
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
```

**Use Cases:**

- ✅ Add custom headers
- ✅ Locale detection (if needed)
- ✅ Rate limiting
- ✅ Logging
- ✅ A/B testing

## 📊 Performance Optimizations

### Server Components

- ✅ Default for all pages
- ✅ Reduced client bundle
- ✅ Server-side data fetching

### React Query Caching

- ✅ 1-minute default stale time
- ✅ Background refetching
- ✅ Optimistic updates

### Code Splitting

- ✅ Automatic route-based splitting
- ✅ Dynamic imports for heavy components

### Image Optimization

- ✅ Next.js Image component ready

## 🔒 Security Considerations

### Current Implementation (Mock)

- ⚠️ Mock auth - any credentials work
- ⚠️ Client-side cookie management
- ⚠️ No real token validation

### Production Recommendations

1. **Use HttpOnly Cookies** (server-set)
2. **Implement CSRF Protection**
3. **Add Rate Limiting**
4. **Validate Tokens Server-Side**
5. **Use Secure Cookies** (HTTPS only)
6. **Implement Refresh Tokens**

## 🚀 Deployment Architecture

### Build Process

```bash
npm run build
# → TypeScript compilation
# → SCSS compilation
# → Bundle optimization
# → Static generation
```

### Environment Variables

```bash
# Client-side (public)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Server-side (private)
BACKEND_API_URL=https://api.yourdomain.com
SESSION_SECRET=strong-random-secret
```

### Recommended Platforms

- ✅ Vercel (optimal for Next.js)
- ✅ Netlify
- ✅ AWS Amplify
- ✅ Docker + any cloud

## 📈 Scalability

### Adding Features

```
1. Create feature folder: features/my-feature/
2. Add BFF module: bff/modules/my-feature.ts
3. Add routes: app/(group)/my-feature/
4. Export public API: features/my-feature/index.ts
```

### Adding Pages

```
1. Choose route group: (auth), (protected), or public
2. Create folder: app/(group)/my-page/
3. Add page.tsx
4. Add metadata
```

### Extending State

```
1. Add Zustand store: shared/stores/my-store.ts
2. Export from: shared/stores/index.ts
3. Use in components
```

## 🎯 Design Decisions

### Why No i18n by Default?

- ✅ Simpler architecture
- ✅ Cleaner URLs
- ✅ Can be added later if needed
- 📁 Legacy i18n files remain (can be removed)

### Why Webpack Instead of Turbopack?

- ✅ Production stability
- ✅ SCSS compatibility
- ✅ Turbopack still experimental
- 🔄 Can switch back when stable

### Why Mock Auth?

- ✅ Development without backend
- ✅ Easy to replace
- ✅ Clear implementation example
- ✅ No external dependencies

### Why Zustand + React Query?

- ✅ React Query: Server state (caching, refetching)
- ✅ Zustand: Client state (lightweight, persistent)
- ✅ Best of both worlds

---

**This architecture is designed for maintainability, scalability, and developer experience.** 🚀
