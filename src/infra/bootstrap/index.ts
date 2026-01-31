/**
 * Bootstrap Module
 * 
 * Centralized app bootstrap flow that:
 * - Loads environment & config
 * - Restores auth/session
 * - Loads feature flags
 * - Resolves locale
 * - Prevents UI flicker
 */

// Types
export type {
  BootstrapState,
  BootstrapContext,
  AppBootstrapConfig,
} from './types';

export { BootstrapStage } from './types';

// Orchestrator
export { bootstrapOrchestrator } from './orchestrator';

// Provider & Hook
export { BootstrapProvider, useBootstrap } from './provider';
