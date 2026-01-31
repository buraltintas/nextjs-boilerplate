/**
 * Home Page Tests
 * 
 * Tests for the main landing page component
 */

import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, className, target, rel }: any) => {
    return (
      <a href={href} className={className} target={target} rel={rel}>
        {children}
      </a>
    );
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  describe('Hero Section', () => {
    it('renders the main heading', () => {
      expect(screen.getByText(/Build faster with/i)).toBeInTheDocument();
      expect(screen.getByText(/enterprise-grade/i)).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      expect(
        screen.getByText(/Comprehensive boilerplate with feature flags/i)
      ).toBeInTheDocument();
    });

    it('renders the badge', () => {
      expect(
        screen.getByText(/Production-Ready Next.js Boilerplate/i)
      ).toBeInTheDocument();
    });

    it('renders status indicators', () => {
      expect(screen.getByText(/Next.js 15.2/i)).toBeInTheDocument();
      
      // TypeScript birden fazla yerde var (status bar + stats), getAllByText kullan
      const typescriptTexts = screen.getAllByText(/TypeScript/i);
      expect(typescriptTexts.length).toBeGreaterThan(0);
      
      expect(screen.getByText(/Production Ready/i)).toBeInTheDocument();
    });

    it('renders Get Started button with correct GitHub link', () => {
      const getStartedButton = screen.getAllByText(/Get Started/i)[0]
        .closest('a');
      
      expect(getStartedButton).toHaveAttribute(
        'href',
        'https://github.com/buraltintas/nextjs-boilerplate'
      );
      expect(getStartedButton).toHaveAttribute('target', '_blank');
      expect(getStartedButton).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Features Section', () => {
    it('renders the section title', () => {
      expect(screen.getByText(/Everything you need/i)).toBeInTheDocument();
    });

    it('renders all 12 feature cards', () => {
      // Test specific feature titles using heading role for specificity
      const featureHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(featureHeadings).toHaveLength(12);
      
      // Test specific features by heading text
      expect(screen.getByRole('heading', { name: /Feature Flags/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Error Handling/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Observability/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Network Strategy/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Real-Time/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Security/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Date\/Time \(Luxon\)/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /State Management/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Testing \(Jest \+ RTL\)/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Modern SCSS/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /BFF Pattern/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Versioning/i })).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
      expect(
        screen.getByText(/Environment-aware flags with remote override support/i)
      ).toBeInTheDocument();
      
      expect(
        screen.getByText(/Complete testing setup with Jest 30/i)
      ).toBeInTheDocument();
    });

    it('renders feature tags', () => {
      // Tag'ler birden fazla yerde olabilir, en az birinin var olduğunu kontrol et
      const clientTags = screen.getAllByText(/Client/i);
      expect(clientTags.length).toBeGreaterThan(0);
      
      const serverTags = screen.getAllByText(/Server/i);
      expect(serverTags.length).toBeGreaterThan(0);
      
      expect(screen.getByText(/Unit/i)).toBeInTheDocument();
      expect(screen.getByText(/Coverage/i)).toBeInTheDocument();
    });
  });

  describe('Stats Section', () => {
    it('renders all stat values', () => {
      expect(screen.getByText(/20\+/i)).toBeInTheDocument();
      expect(screen.getByText(/10\/10/i)).toBeInTheDocument();
    });

    it('renders stat labels', () => {
      expect(screen.getByText(/Production Features/i)).toBeInTheDocument();
      expect(screen.getByText(/Ready Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Type Safe/i)).toBeInTheDocument();
      
      // "Compatible" text birden fazla yerde var, daha spesifik query
      const statLabels = screen.getAllByText(/Compatible/i);
      expect(statLabels.length).toBeGreaterThan(0);
    });
  });

  describe('CTA Section', () => {
    it('renders the CTA title', () => {
      expect(
        screen.getByText(/Ready to build something amazing\?/i)
      ).toBeInTheDocument();
    });

    it('renders the CTA subtitle', () => {
      expect(
        screen.getByText(/Start with a production-ready foundation/i)
      ).toBeInTheDocument();
    });

    it('renders Start Building button with correct GitHub link', () => {
      const startBuildingButton = screen.getByText(/Start Building/i)
        .closest('a');
      
      expect(startBuildingButton).toHaveAttribute(
        'href',
        'https://github.com/buraltintas/nextjs-boilerplate'
      );
      expect(startBuildingButton).toHaveAttribute('target', '_blank');
      expect(startBuildingButton).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Accessibility', () => {
    it('has sections with proper HTML structure', () => {
      // Section elementlerini test et
      const sections = document.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('all external links have proper security attributes', () => {
      const externalLinks = screen.getAllByRole('link').filter((link) =>
        link.getAttribute('href')?.startsWith('https://github.com')
      );

      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Content Structure', () => {
    it('renders feature cards with proper structure', () => {
      const featureCards = document.querySelectorAll('.featureCard');
      expect(featureCards.length).toBe(12);
    });

    it('has correct heading hierarchy', () => {
      // h1 - Ana başlık
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);

      // h2 - Section başlıkları
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);

      // h3 - Feature başlıkları (12 tane)
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements).toHaveLength(12);
    });
  });
});
