/**
 * Bootstrap Orchestrator
 * 
 * Centralized bootstrap sequence that prevents UI flicker and incorrect redirects
 * 
 * Bootstrap Flow:
 * 1. Load environment & config
 * 2. Restore auth/session
 * 3. Load feature flags
 * 4. Resolve locale
 * 5. Mark as ready
 */

import { BootstrapStage, BootstrapState, AppBootstrapConfig, BootstrapContext } from './types';
import { config } from '@/infra/config';
import { featureFlagsProvider } from '@/infra/feature-flags/provider';
import { getSessionToken } from '@/features/auth/lib/server-auth';
import { logInfo, logError } from '@/infra/observability';

class BootstrapOrchestrator {
  private state: BootstrapState = {
    stage: BootstrapStage.INITIAL,
    isReady: false,
    error: null,
    config: null,
  };

  private context: Partial<BootstrapContext> = {};
  private listeners: Array<(state: BootstrapState) => void> = [];

  /**
   * Run bootstrap sequence (server-side)
   */
  async runServerBootstrap(): Promise<BootstrapContext> {
    try {
      logInfo('[Bootstrap] Starting server bootstrap');

      // Stage 1: Load config
      await this.loadConfig();

      // Stage 2: Restore session
      await this.restoreSession();

      // Stage 3: Load feature flags
      await this.loadFeatureFlags();

      // Stage 4: Resolve locale
      await this.resolveLocale();

      // Mark as ready
      this.updateState(BootstrapStage.READY);
      logInfo('[Bootstrap] Server bootstrap complete');

      return this.context as BootstrapContext;
    } catch (error) {
      logError('[Bootstrap] Server bootstrap failed', { error });
      this.updateState(BootstrapStage.ERROR, error as Error);
      throw error;
    }
  }

  /**
   * Run bootstrap sequence (client-side)
   */
  async runClientBootstrap(): Promise<BootstrapContext> {
    try {
      logInfo('[Bootstrap] Starting client bootstrap');

      // Stage 1: Load config
      await this.loadConfig();

      // Stage 3: Load feature flags (session already restored by server)
      await this.loadFeatureFlags();

      // Stage 4: Resolve locale (from browser)
      await this.resolveLocale();

      // Mark as ready
      this.updateState(BootstrapStage.READY);
      logInfo('[Bootstrap] Client bootstrap complete');

      return this.context as BootstrapContext;
    } catch (error) {
      logError('[Bootstrap] Client bootstrap failed', { error });
      this.updateState(BootstrapStage.ERROR, error as Error);
      throw error;
    }
  }

  /**
   * Stage 1: Load environment & config
   */
  private async loadConfig(): Promise<void> {
    this.updateState(BootstrapStage.LOADING_CONFIG);

    this.context.config = {
      apiUrl: config.api.baseUrl,
      appUrl: config.app.url,
      environment: config.app.env,
      version: config.app.version,
    };

    logInfo('[Bootstrap] Config loaded', this.context.config);
  }

  /**
   * Stage 2: Restore auth/session (server-side only)
   */
  private async restoreSession(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Skip on client (session restored by server)
      this.context.isAuthenticated = false;
      return;
    }

    this.updateState(BootstrapStage.RESTORING_SESSION);

    try {
      const token = await getSessionToken();
      this.context.isAuthenticated = !!token;
      logInfo('[Bootstrap] Session restored', { isAuthenticated: this.context.isAuthenticated });
    } catch (error) {
      logError('[Bootstrap] Session restore failed', { error });
      this.context.isAuthenticated = false;
    }
  }

  /**
   * Stage 3: Load feature flags
   */
  private async loadFeatureFlags(): Promise<void> {
    this.updateState(BootstrapStage.LOADING_FEATURE_FLAGS);

    try {
      await featureFlagsProvider.fetchRemoteFlags();
      this.context.featureFlagsLoaded = true;
      logInfo('[Bootstrap] Feature flags loaded');
    } catch (error) {
      logError('[Bootstrap] Feature flags load failed', { error });
      this.context.featureFlagsLoaded = false;
    }
  }

  /**
   * Stage 4: Resolve locale
   */
  private async resolveLocale(): Promise<void> {
    this.updateState(BootstrapStage.RESOLVING_LOCALE);

    // Server-side: use Accept-Language header
    if (typeof window === 'undefined') {
      this.context.locale = 'en'; // Default
    } else {
      // Client-side: use browser language
      this.context.locale = navigator.language.split('-')[0] || 'en';
    }

    logInfo('[Bootstrap] Locale resolved', { locale: this.context.locale });
  }

  /**
   * Update bootstrap state
   */
  private updateState(stage: BootstrapStage, error: Error | null = null): void {
    this.state = {
      stage,
      isReady: stage === BootstrapStage.READY,
      error,
      config: this.context.config || null,
    };

    // Notify listeners
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Subscribe to bootstrap state changes
   */
  subscribe(listener: (state: BootstrapState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get current state
   */
  getState(): BootstrapState {
    return this.state;
  }

  /**
   * Get context
   */
  getContext(): Partial<BootstrapContext> {
    return this.context;
  }

  /**
   * Reset bootstrap (for testing)
   */
  reset(): void {
    this.state = {
      stage: BootstrapStage.INITIAL,
      isReady: false,
      error: null,
      config: null,
    };
    this.context = {};
  }
}

// Singleton instance
export const bootstrapOrchestrator = new BootstrapOrchestrator();
