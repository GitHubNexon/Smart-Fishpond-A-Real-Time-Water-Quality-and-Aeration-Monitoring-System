// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { publicRoutes } from '@/utils/route-constants';

interface HealthCheckResponse {
  status: 'ok' | 'error';
  serverTime?: string;
  database: 'connected' | 'disconnected';
  dbName?: string;
  host?: string;
  port?: number;
  pgVersion?: string;
  environment?: string;
}

let lastHealthCheck: { timestamp: number; isHealthy: boolean } | null = null;
const HEALTH_CHECK_CACHE_MS = 30000; // Cache for 30 seconds

async function checkServerHealth(): Promise<boolean> {
  // Return cached result if available and fresh
  if (
    lastHealthCheck &&
    Date.now() - lastHealthCheck.timestamp < HEALTH_CHECK_CACHE_MS
  ) {
    return lastHealthCheck.isHealthy;
  }

  const healthCheckUrl =
    process.env.NEXT_PUBLIC_SERVER_HEALTH_CHECK_URL ||
    'http://localhost:3005/api/health';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(healthCheckUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: HealthCheckResponse = await response.json();
      const isHealthy = data.status === 'ok' && data.database === 'connected';

      // Cache the result
      lastHealthCheck = {
        timestamp: Date.now(),
        isHealthy,
      };

      return isHealthy;
    }

    // Non-200 response
    lastHealthCheck = {
      timestamp: Date.now(),
      isHealthy: false,
    };
    return false;
  } catch (error) {
    console.error('Health check failed:', error);

    // Cache the failure
    lastHealthCheck = {
      timestamp: Date.now(),
      isHealthy: false,
    };
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  // Check if maintenance mode is enabled
  if (maintenanceMode) {
    const isMaintenancePath =
      pathname === '/maintenance' ||
      pathname.startsWith('/maintenance/') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico');

    if (!isMaintenancePath) {
      return NextResponse.redirect(new URL('/maintenance', req.url));
    }

    return NextResponse.next();
  }

  // Allow public routes (check this first)
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Skip health check for certain paths (including home page to avoid redirect loop)
  const skipHealthCheckPaths = [
    '/',
    '/login',
    '/maintenance',
    '/server-down',
    '/_next',
    '/favicon.ico',
    '/api/health',
  ];

  const shouldSkipHealthCheck = skipHealthCheckPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  );

  // Only perform health check for authenticated/protected routes
  if (!shouldSkipHealthCheck) {
    const isServerHealthy = await checkServerHealth();

    if (!isServerHealthy) {
      console.warn(
        `Server health check failed for ${pathname}, redirecting to server-down page`,
      );
      return NextResponse.redirect(new URL('/server-down', req.url));
    }
  }

  // Check authentication
  const mainToken = req.cookies.get('_auth_token_')?.value;
  // const passkeyToken =
  //   req.cookies.get('_passkey_token_')?.value ||
  //   req.cookies.get(process.env.PASSKEY_TOKEN_NAME ?? '_passkey_token_')?.value;

  const sessionId = req.cookies.get('sessionId')?.value;

  // const hasFullAuth = mainToken && passkeyToken && sessionId;
  const hasFullAuth = mainToken && sessionId;

  if (!hasFullAuth) {
    const redirectUrl = new URL('/login', req.url);
    if (req.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|txt|xml|json)$|backend/.*|uploads/.*).*)',
  ],
};
