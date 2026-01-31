# Next.js Production Boilerplate

⚡ Enterprise-grade Next.js starter with production-ready features and best practices built-in.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Features

- ⚡ **Next.js 16** - App Router, Server Components, SSR
- 🔷 **TypeScript** - Full type safety
- 🏗️ **Clean Architecture** - Domain-driven design, BFF pattern
- 🔄 **State Management** - React Query (server) + Zustand (client)
- 🔐 **Auth Flow** - Cookie-based session management
- 🚩 **Feature Flags** - Environment-aware toggles
- ⚠️ **Error Handling** - Global boundaries & normalized errors
- 📊 **Observability** - Provider-agnostic analytics/logging
- 🌐 **Network Strategy** - Retry logic, degraded mode
- 🔴 **Real-Time** - WebSocket/Socket.IO infrastructure
- 🧪 **Testing** - Jest + React Testing Library
- 🎨 **Modern SCSS** - Path aliases, auto-inject variables
- 📅 **Luxon** - Date/time utilities
- 🔢 **Versioning** - Cache busting & compatibility checks

## 📦 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Run development server
npm run dev

# 4. Open browser
http://localhost:3000
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (protected)/       # Protected routes (dashboard, users)
│   └── page.tsx           # Home page
├── bff/                   # Backend-for-Frontend layer
├── features/              # Feature modules (auth, users)
├── shared/                # Shared components, hooks, stores
├── infra/                 # Infrastructure (config, observability)
└── styles/                # Global SCSS
```

## 🔧 Scripts

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server
npm test                # Run tests
npm run lint            # Run ESLint
npm run type-check      # TypeScript checks
```

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICKSTART.md)** - Detailed setup instructions
- **[Architecture](./docs/ARCHITECTURE.md)** - System design & patterns
- **[Features Summary](./docs/FEATURES_SUMMARY.md)** - All features overview
- **[File Structure](./docs/FILE_STRUCTURE.md)** - Complete directory guide
- **[Testing Guide](./docs/TESTING.md)** - Testing best practices

## 🛠️ Tech Stack

### Core
- **Next.js 16.1.6** - React framework
- **React 19.0.0** - UI library
- **TypeScript 5.7.2** - Type safety

### State & Data
- **@tanstack/react-query 5.90.20** - Server state management
- **Zustand 5.0.10** - Client state with persistence

### Styling
- **SASS 1.97.3** - CSS preprocessor with modern syntax

### Real-Time
- **Socket.IO Client 4.8.3** - WebSocket communication

### Date/Time
- **Luxon 3.5.0** - Modern date library

### Testing
- **Jest 30.2.0** - Test runner
- **React Testing Library 16.3.2** - Component testing

## 🔐 Authentication

Mock authentication is included for development:
- Any email/password combination works
- Session stored in HttpOnly cookie
- Protected routes redirect to login
- Post-login redirect to intended destination

**To connect real backend:** Update `src/bff/modules/auth.ts`

## 🌐 Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API (mock for now)
BACKEND_API_URL=http://localhost:4000/api

# Session
SESSION_COOKIE_NAME=session
SESSION_SECRET=your-secret-key-change-in-production

# Feature Flags (optional)
NEXT_PUBLIC_FF_*=true/false

# Observability (optional)
NEXT_PUBLIC_OBSERVABILITY_ENABLED=true
OBSERVABILITY_PROVIDER=console

# Real-Time (optional)
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

### Docker

```bash
# Build image
docker build -t nextjs-boilerplate .

# Run container
docker run -p 3000:3000 nextjs-boilerplate
```

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 💬 Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/buraltintas/nextjs-boilerplate/issues)
- 💡 [Feature Requests](https://github.com/buraltintas/nextjs-boilerplate/issues)

---

**Built with ❤️ for modern Next.js development**
