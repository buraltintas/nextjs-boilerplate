/**
 * Bootstrap Types
 */

/**
 * Bootstrap stage
 */
export enum BootstrapStage {
  INITIAL = 'initial',
  LOADING_CONFIG = 'loading_config',
  RESTORING_SESSION = 'restoring_session',
  LOADING_FEATURE_FLAGS = 'loading_feature_flags',
  RESOLVING_LOCALE = 'resolving_locale',
  READY = 'ready',
  ERROR = 'error',
}

/**
 * Bootstrap state
 */
export interface BootstrapState {
  stage: BootstrapStage;
  isReady: boolean;
  error: Error | null;
  config: AppBootstrapConfig | null;
}

/**
 * App bootstrap configuration
 */
export interface AppBootstrapConfig {
  apiUrl: string;
  appUrl: string;
  environment: string;
  version: string;
}

/**
 * Bootstrap context
 */
export interface BootstrapContext {
  config: AppBootstrapConfig;
  isAuthenticated: boolean;
  featureFlagsLoaded: boolean;
  locale: string;
}
