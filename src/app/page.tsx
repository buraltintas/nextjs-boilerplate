import Link from 'next/link';
import styles from './home.module.scss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Production Boilerplate - Enterprise-Grade Architecture',
  description: 'Comprehensive Next.js boilerplate with feature flags, real-time infrastructure, error handling, observability, and more. Production-ready from day one.',
};

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGradient}></div>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>⚡</span>
            <span>Production-Ready Next.js Boilerplate</span>
          </div>
          
          <h1 className={styles.title}>
            Build faster with
            <span className={styles.gradient}> enterprise-grade</span>
            <br />
            architecture
          </h1>
          
          <p className={styles.subtitle}>
            Comprehensive boilerplate with feature flags, real-time infrastructure,
            error handling, observability, and more. Ready for production from day one.
          </p>

          <div className={styles.actions}>
            <Link 
              href="https://github.com/buraltintas/nextjs-boilerplate" 
              className={styles.primaryButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Get Started</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>

          <div className={styles.statusBar}>
            <div className={styles.statusItem}>
              <span className={styles.statusDot}></span>
              <span>Next.js 16.1.6</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusDot}></span>
              <span>TypeScript</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusDot}></span>
              <span>Production Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything you need</h2>
          <p className={styles.sectionSubtitle}>
            Production-proven patterns and best practices built-in
          </p>
        </div>

        <div className={styles.featureGrid}>
          {/* Feature 1 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚩</div>
            <h3 className={styles.featureTitle}>Feature Flags</h3>
            <p className={styles.featureDescription}>
              Environment-aware flags with remote override support. SSR compatible.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>Client</span>
              <span className={styles.tag}>Server</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚠️</div>
            <h3 className={styles.featureTitle}>Error Handling</h3>
            <p className={styles.featureDescription}>
              Global boundaries, normalized errors, and reusable UI components.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>Recoverable</span>
              <span className={styles.tag}>Fatal</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Observability</h3>
            <p className={styles.featureDescription}>
              Provider-agnostic analytics, error tracking, and structured logging.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>Analytics</span>
              <span className={styles.tag}>Monitoring</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌐</div>
            <h3 className={styles.featureTitle}>Network Strategy</h3>
            <p className={styles.featureDescription}>
              Retry logic, timeouts, and degraded mode with auto-recovery.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>Retry</span>
              <span className={styles.tag}>Fallback</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔴</div>
            <h3 className={styles.featureTitle}>Real-Time</h3>
            <p className={styles.featureDescription}>
              WebSocket infrastructure with React Query integration. Client-only.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>Socket.IO</span>
              <span className={styles.tag}>Events</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔐</div>
            <h3 className={styles.featureTitle}>Security</h3>
            <p className={styles.featureDescription}>
              Token sanitization, safe logging, and secure cookie defaults.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>HttpOnly</span>
              <span className={styles.tag}>CSRF</span>
            </div>
          </div>

          {/* Feature 7 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📅</div>
            <h3 className={styles.featureTitle}>Date/Time (Luxon)</h3>
            <p className={styles.featureDescription}>
              Modern date library with timezone support and relative formatting.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>i18n</span>
              <span className={styles.tag}>Timezone</span>
            </div>
          </div>

          {/* Feature 8 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <h3 className={styles.featureTitle}>State Management</h3>
            <p className={styles.featureDescription}>
              React Query for server state, Zustand for client with persistence.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>SSR</span>
              <span className={styles.tag}>Cache</span>
            </div>
          </div>

          {/* Feature 9 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧪</div>
            <h3 className={styles.featureTitle}>Testing (Jest + RTL)</h3>
            <p className={styles.featureDescription}>
              Complete testing setup with Jest 30 and React Testing Library 16.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>Unit</span>
              <span className={styles.tag}>Coverage</span>
            </div>
          </div>

          {/* Feature 10 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3 className={styles.featureTitle}>Modern SCSS</h3>
            <p className={styles.featureDescription}>
              Path aliases, auto-inject variables, and responsive mixins.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>@use</span>
              <span className={styles.tag}>Modules</span>
            </div>
          </div>

          {/* Feature 11 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏗️</div>
            <h3 className={styles.featureTitle}>BFF Pattern</h3>
            <p className={styles.featureDescription}>
              Backend-for-Frontend layer with retry logic and network strategy.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>API</span>
              <span className={styles.tag}>Proxy</span>
            </div>
          </div>

          {/* Feature 12 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔢</div>
            <h3 className={styles.featureTitle}>Versioning</h3>
            <p className={styles.featureDescription}>
              App version awareness with cache busting and forced reload support.
            </p>
            <div className={styles.featureTags}>
              <span className={styles.tag}>Cache</span>
              <span className={styles.tag}>Compat</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsCard}>
          <div className={styles.stat}>
            <div className={styles.statValue}>20+</div>
            <div className={styles.statLabel}>Production Features</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <div className={styles.statValue}>10/10</div>
            <div className={styles.statLabel}>Ready Score</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <div className={styles.statValue}>TypeScript</div>
            <div className={styles.statLabel}>Type Safe</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <div className={styles.statValue}>SSR</div>
            <div className={styles.statLabel}>Compatible</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready to build something amazing?
          </h2>
          <p className={styles.ctaSubtitle}>
            Start with a production-ready foundation and ship faster.
          </p>
          <Link 
            href="https://github.com/buraltintas/nextjs-boilerplate" 
            className={styles.ctaButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Start Building</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </div>
        <div className={styles.ctaGradient}></div>
      </section>
    </div>
  );
}
