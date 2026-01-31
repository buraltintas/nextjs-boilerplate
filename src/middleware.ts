import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware
 * 
 * Adds custom headers like pathname for protected route handling
 */

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add the pathname to headers so it's available in layouts
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  
  // Return response with updated headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
