import Link from 'next/link';
import { metadataPresets } from '@/infra/seo';
import type { Metadata } from 'next';
import styles from './home.module.scss';

/**
 * Home Page (Public)
 */

export const metadata: Metadata = metadataPresets.home();

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Your App</h1>
          <p>
            A production-ready Next.js boilerplate with best practices
          </p>
          <div className={styles.heroButtons}>
            <Link href="/register" className="btn btn-white">
              Get Started
            </Link>
            <Link href="/login" className="btn btn-outline-white">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Features</h2>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🚀</div>
            <h3>Fast & Modern</h3>
            <p>
              Built with Next.js 16, TypeScript, and the latest web technologies
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>🔒</div>
            <h3>Secure</h3>
            <p>
              Cookie-based authentication with HttpOnly cookies and CSRF protection
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>🌍</div>
            <h3>International</h3>
            <p>
              Multi-language support detected from browser
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>📱</div>
            <h3>Responsive</h3>
            <p>
              Mobile-first design that works on all devices
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>⚡</div>
            <h3>Optimized</h3>
            <p>
              Server-side rendering and React Query for optimal performance
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>🎨</div>
            <h3>Beautiful UI</h3>
            <p>
              Clean and modern interface with attention to detail
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
