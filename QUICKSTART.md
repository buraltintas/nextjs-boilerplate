# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## 📋 Prerequisites

- **Node.js** >= 20.9.0 (recommended: v24)
- **npm** or **yarn**

### Check Node Version

```bash
node --version  # Should be >= 20.9.0
```

### Install/Update Node (if needed)

```bash
# Using nvm (recommended)
nvm install 24
nvm use 24

# Or download from https://nodejs.org/
```

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create `.env` in the project root:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API (mock for now - not used)
BACKEND_API_URL=http://localhost:4000/api

# Session Configuration
SESSION_COOKIE_NAME=session
SESSION_SECRET=your-secret-key-change-in-production
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open Browser

```
http://localhost:3000
```

🎉 **You're all set!** The app is running.

## 🧪 Test the Auth Flow

### Test Scenario 1: Register → Dashboard

1. **Go to home page:**

   ```
   http://localhost:3000
   ```

2. **Click "Get Started"** → Takes you to `/register`

3. **Fill the form** (any data works - it's mocked):

   ```
   Name: John Doe
   Email: john@example.com
   Password: password123
   Confirm: password123
   ```

4. **Click "Register"**

   - ✅ Mock API accepts it (500ms delay)
   - ✅ Session cookie is set
   - ✅ Redirects to `/dashboard`

5. **You're in!** Dashboard shows your info

### Test Scenario 2: Protected Route → Login → Redirect Back

1. **Logout first** (click Logout button)

2. **Try to access dashboard directly:**

   ```
   http://localhost:3000/dashboard
   ```

3. **Server checks auth:**

   - ❌ No session cookie found
   - 🔄 Redirects to: `/login?redirectTo=%2Fdashboard`

4. **Login with any credentials:**

   ```
   Email: test@example.com
   Password: anything
   ```

5. **After login:**
   - ✅ Session cookie set
   - 🔄 Automatically redirects to `/dashboard` (your original destination!)

### Test Scenario 3: Logout

1. **Click "Logout" in dashboard**

   - ✅ Cookie cleared
   - ✅ Auth store cleared
   - 🔄 Redirects to `/` (home)

2. **Try accessing dashboard again:**
   - ❌ Redirects to login (no session)

## 📂 Available Pages

### Public Pages

- `/` - Home page (public)
- `/login` - Login page
- `/register` - Register page

### Protected Pages (require auth)

- `/dashboard` - User dashboard
- `/users` - Users management

### Other

- `/404` - Not found page

## 🔑 Mock Authentication

**All credentials work!** The auth system is mocked:

```typescript
// Any email/password combination works
Email: anything@example.com
Password: anything123

// Mock response
{
  user: { id: '1', name: 'John Doe', email: 'anything@example.com', role: 'admin' },
  token: 'mock-jwt-token-1234567890'
}
```

### How It Works

1. **Login/Register** → Mock API returns dummy token
2. **Token saved to cookie** → `document.cookie = 'session=...';`
3. **Server checks cookie** → `getServerSession()` validates token
4. **Protected routes** → Redirect if no cookie

### Replace with Real Backend

See `src/bff/modules/auth.ts` - replace mock functions with real API calls.

## 🗃️ State Management

### Test Zustand Persistence

1. **Login to dashboard**
2. **Open DevTools → Application → Local Storage**
3. **See persisted state:**

   ```
   auth-storage: { userHint: {...}, isAuthenticatedHint: true }
   preferences-storage: { preferredLanguage: null, ... }
   ui-storage: { isSidebarOpen: true, theme: 'system' }
   ```

4. **Refresh page** → State persists! 🎉

### Test React Query

1. **Go to `/users` page** (protected)
2. **Open DevTools → Network**
3. **See:** Mock API call with delay
4. **Data cached** for 5 minutes (configurable)

## 🎨 Test Styling

### SCSS Variables & Mixins (Auto-imported)

Create a test component:

```scss
// src/app/test.module.scss
.test {
  color: $color-primary; // Auto-imported!
  padding: $spacing-md;

  @include md {
    // Responsive mixin
    padding: $spacing-lg;
  }
}
```

No need to import variables/mixins - they're auto-injected!

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types
```

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Node Version Too Old

```bash
# Error: "Node.js version >=20.9.0 is required"

# Solution: Update Node.js
nvm install 24
nvm use 24
```

### SCSS Compile Error

```bash
# Error: "Sass support not found"

# Solution: Install sass
npm install sass
```

### Turbopack Crashes

Already handled - Webpack is used by default for stability.

### Clear Cache

```bash
# If weird errors persist
rm -rf .next
npm run dev
```

## 🎯 Next Steps

### 1. Explore the Code

Start with these files:

```
src/app/page.tsx                      # Home page
src/app/(auth)/login/page.tsx         # Login page
src/app/(protected)/dashboard/page.tsx # Dashboard
src/bff/modules/auth.ts               # Mock auth API
src/features/auth/hooks/use-auth.ts   # Auth hooks
```

### 2. Customize Styling

```
src/styles/_variables.scss            # Change colors, spacing
src/styles/_mixins.scss               # Add custom mixins
src/app/page.tsx                      # Edit home page
```

### 3. Add Your First Feature

```bash
# Create feature structure
mkdir -p src/features/my-feature/{components,hooks}

# Add component
# src/features/my-feature/components/my-component.tsx

# Export it
# src/features/my-feature/index.ts
```

### 4. Connect Real Backend

Replace mocks in `src/bff/modules/auth.ts`:

```typescript
// Before (mock)
export const authApi = {
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { user: {...}, token: '...' }, error: null };
  }
};

// After (real)
import { bffClient } from '../client';

export const authApi = {
  login: async (credentials) => {
    return bffClient.post('/auth/login', credentials);
  }
};
```

### 5. Deploy

```bash
# Build production bundle
npm run build

# Test production locally
npm start

# Deploy to Vercel/Netlify
# Follow platform-specific instructions
```

## 📚 Learn More

- **[README.md](./README.md)** - Full feature list and overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture deep dive
- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - Complete file structure

## 💡 Tips

1. **Hot Reload:** Code changes reflect instantly (no need to refresh)
2. **TypeScript:** Strict mode catches errors early
3. **Path Aliases:** Use `@/` instead of `../../`
4. **SCSS:** Variables auto-imported in all `.scss` files
5. **Auth:** All credentials work in mock mode
6. **Zustand:** State persists across browser refreshes
7. **React Query:** Data cached automatically

---

**Happy coding! 🚀**

Need help? Check the docs or inspect the code - it's well-commented!
