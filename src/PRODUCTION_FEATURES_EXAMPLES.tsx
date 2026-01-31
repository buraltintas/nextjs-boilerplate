/**
 * Production-Ready Feature Examples
 * 
 * Real-world usage examples for production features
 */

// ============================================
// 1. FEATURE FLAGS USAGE
// ============================================

import { useFeatureFlag, FeatureGate } from '@/infra/feature-flags';
import { isFeatureEnabled } from '@/infra/feature-flags';

/**
 * Example: Client-side feature flag
 */
export function NewDashboardExample() {
  const isNewDashboardEnabled = useFeatureFlag('experimental.new-dashboard');

  if (isNewDashboardEnabled) {
    return <div>New Dashboard (Feature Flag Enabled)</div>;
  }

  return <div>Old Dashboard</div>;
}

/**
 * Example: Feature gate component
 */
export function FeatureGatedContent() {
  return (
    <FeatureGate
      flag="feature.dark-mode"
      fallback={<div>Dark mode not available</div>}
    >
      <div>Dark Mode UI</div>
    </FeatureGate>
  );
}

/**
 * Example: Server-side feature flag
 */
export async function ServerDashboard() {
  const canShowAnalytics = await isFeatureEnabled('feature.analytics');

  return (
    <div>
      <h1>Dashboard</h1>
      {canShowAnalytics && <AnalyticsWidget />}
    </div>
  );
}

// ============================================
// 2. ERROR HANDLING USAGE
// ============================================

import { ErrorBoundary, ErrorCard, normalizeError } from '@/infra/errors';

/**
 * Example: Route-level error boundary
 */
export function ProfilePage() {
  return (
    <ErrorBoundary
      level="route"
      fallback={(error, reset) => (
        <ErrorCard error={error} onRetry={reset} />
      )}
    >
      <UserProfile />
    </ErrorBoundary>
  );
}

/**
 * Example: Error normalization in try-catch
 */
async function fetchUserData() {
  try {
    const response = await fetch('/api/user');
    return await response.json();
  } catch (error) {
    const normalized = normalizeError(error);
    console.error('Failed to fetch user:', normalized);
    throw normalized;
  }
}

// ============================================
// 3. OBSERVABILITY USAGE
// ============================================

import {
  trackEvent,
  identifyUser,
  logInfo,
  logError,
  captureError,
} from '@/infra/observability';

/**
 * Example: Track button click
 */
export function SignupButton() {
  const handleClick = () => {
    trackEvent('signup_button_clicked', {
      page: 'home',
      variant: 'primary',
    });
  };

  return <button onClick={handleClick}>Sign Up</button>;
}

/**
 * Example: Identify user after login
 */
async function handleLogin(email: string, password: string) {
  const user = await loginUser(email, password);

  // Identify user for analytics
  identifyUser({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  logInfo('User logged in', { userId: user.id });
}

/**
 * Example: Capture error with context
 */
async function processPayment(amount: number) {
  try {
    await chargeCard(amount);
  } catch (error) {
    captureError(error as Error, {
      context: 'payment',
      amount,
      timestamp: Date.now(),
    });
    throw error;
  }
}

// ============================================
// 4. NETWORK & DEGRADED MODE USAGE
// ============================================

import { useIsDegraded, useNetworkStatus, NetworkStatus } from '@/infra/network';

/**
 * Example: Show read-only mode when degraded
 */
export function EditableForm() {
  const isDegraded = useIsDegraded();

  return (
    <form>
      <input disabled={isDegraded} />
      <button disabled={isDegraded}>
        {isDegraded ? 'Unavailable (Network Issue)' : 'Save'}
      </button>
    </form>
  );
}

/**
 * Example: Network status indicator
 */
export function NetworkStatusIndicator() {
  const status = useNetworkStatus();

  const colors = {
    [NetworkStatus.ONLINE]: 'green',
    [NetworkStatus.DEGRADED]: 'orange',
    [NetworkStatus.OFFLINE]: 'red',
  };

  return (
    <div style={{ color: colors[status] }}>
      {status === NetworkStatus.ONLINE && '● Online'}
      {status === NetworkStatus.DEGRADED && '● Limited'}
      {status === NetworkStatus.OFFLINE && '● Offline'}
    </div>
  );
}

// ============================================
// 5. BOOTSTRAP USAGE
// ============================================

import { useBootstrap } from '@/infra/bootstrap';

/**
 * Example: Access bootstrap context
 */
export function AppInfo() {
  const { context } = useBootstrap();

  return (
    <div>
      <p>App Version: {context.config?.version}</p>
      <p>Environment: {context.config?.environment}</p>
      <p>Authenticated: {context.isAuthenticated ? 'Yes' : 'No'}</p>
    </div>
  );
}

// ============================================
// 6. VERSIONING USAGE
// ============================================

import {
  getAppVersion,
  checkCompatibility,
  forceReload,
} from '@/infra/versioning';

/**
 * Example: Check compatibility on app start
 */
export async function initializeApp() {
  const version = getAppVersion();
  console.log('App version:', version);

  const compat = await checkCompatibility();
  
  if (compat.forceUpdate) {
    alert('A new version is available. The app will reload.');
    forceReload();
  }
}

/**
 * Example: Version display
 */
export function VersionInfo() {
  const version = getAppVersion();

  return (
    <div>
      v{version.current} ({version.environment})
    </div>
  );
}

// ============================================
// 7. SECURITY USAGE
// ============================================

import {
  safeLog,
  sanitizeRedirectUrl,
  isValidTokenFormat,
} from '@/infra/security';

/**
 * Example: Safe logging
 */
function logRequestData(data: any) {
  // Automatically redacts sensitive data
  console.log(safeLog(data));
}

/**
 * Example: Safe redirect
 */
function handleRedirect(redirectUrl: string) {
  const safe = sanitizeRedirectUrl(redirectUrl);
  
  if (safe) {
    window.location.href = safe;
  } else {
    console.error('Invalid redirect URL');
  }
}

/**
 * Example: Token validation
 */
function validateAuthToken(token: string) {
  if (!isValidTokenFormat(token)) {
    throw new Error('Invalid token format');
  }
  
  // Proceed with token
}

// ============================================
// 8. COMBINING EVERYTHING
// ============================================

/**
 * Example: Complete component with all features
 */
export function ProductionReadyComponent() {
  const isDegraded = useIsDegraded();
  const showNewUI = useFeatureFlag('experimental.new-dashboard');

  const handleAction = async () => {
    trackEvent('action_clicked');

    try {
      const result = await performAction();
      logInfo('Action completed', { result });
    } catch (error) {
      const normalized = normalizeError(error);
      captureError(normalized.originalError || new Error(normalized.message));
      logError('Action failed', { error: normalized });
    }
  };

  return (
    <ErrorBoundary level="route">
      <div>
        {isDegraded && (
          <div>Some features may be unavailable</div>
        )}
        
        <FeatureGate flag="feature.analytics">
          <AnalyticsWidget />
        </FeatureGate>

        {showNewUI ? <NewUI /> : <OldUI />}

        <button onClick={handleAction} disabled={isDegraded}>
          Perform Action
        </button>
      </div>
    </ErrorBoundary>
  );
}

// Dummy components for examples
function AnalyticsWidget() { return <div>Analytics</div>; }
function UserProfile() { return <div>Profile</div>; }
function NewUI() { return <div>New UI</div>; }
function OldUI() { return <div>Old UI</div>; }
async function loginUser(email: string, password: string) { return { id: '1', email, name: 'User' }; }
async function chargeCard(amount: number) { return true; }
async function performAction() { return 'success'; }
