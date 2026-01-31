/**
 * Bootstrap Provider Component
 * 
 * Client-side provider for bootstrap state
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BootstrapState, BootstrapStage, BootstrapContext as BootstrapCtx } from './types';
import { bootstrapOrchestrator } from './orchestrator';

interface BootstrapContextValue {
  state: BootstrapState;
  context: Partial<BootstrapCtx>;
}

const BootstrapContext = createContext<BootstrapContextValue | null>(null);

/**
 * Bootstrap Provider
 * 
 * Wraps the app and manages client-side bootstrap
 */
export function BootstrapProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BootstrapState>(() => bootstrapOrchestrator.getState());
  const [context, setContext] = useState<Partial<BootstrapCtx>>(() => bootstrapOrchestrator.getContext());

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = bootstrapOrchestrator.subscribe(setState);

    // Run client bootstrap
    bootstrapOrchestrator.runClientBootstrap().then((ctx) => {
      setContext(ctx);
    }).catch((error) => {
      console.error('[Bootstrap] Client bootstrap failed:', error);
    });

    return unsubscribe;
  }, []);

  // Show loading screen until ready
  if (!state.isReady && state.stage !== BootstrapStage.ERROR) {
    return <BootstrapLoadingScreen stage={state.stage} />;
  }

  // Show error screen if bootstrap failed
  if (state.stage === BootstrapStage.ERROR && state.error) {
    return <BootstrapErrorScreen error={state.error} />;
  }

  return (
    <BootstrapContext.Provider value={{ state, context }}>
      {children}
    </BootstrapContext.Provider>
  );
}

/**
 * Hook to access bootstrap state
 */
export function useBootstrap() {
  const context = useContext(BootstrapContext);
  
  if (!context) {
    throw new Error('useBootstrap must be used within BootstrapProvider');
  }

  return context;
}

/**
 * Bootstrap Loading Screen
 */
function BootstrapLoadingScreen({ stage }: { stage: BootstrapStage }) {
  const message = getStageMessage(stage);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      
      <p
        style={{
          marginTop: '1rem',
          color: '#6b7280',
          fontSize: '0.875rem',
        }}
      >
        {message}
      </p>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Bootstrap Error Screen
 */
function BootstrapErrorScreen({ error }: { error: Error }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
        }}
      >
        Failed to start application
      </h2>
      
      <p
        style={{
          color: '#6b7280',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        {error.message}
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  );
}

/**
 * Get user-friendly message for each stage
 */
function getStageMessage(stage: BootstrapStage): string {
  switch (stage) {
    case BootstrapStage.INITIAL:
      return 'Starting...';
    case BootstrapStage.LOADING_CONFIG:
      return 'Loading configuration...';
    case BootstrapStage.RESTORING_SESSION:
      return 'Restoring session...';
    case BootstrapStage.LOADING_FEATURE_FLAGS:
      return 'Loading feature flags...';
    case BootstrapStage.RESOLVING_LOCALE:
      return 'Resolving locale...';
    default:
      return 'Loading...';
  }
}
