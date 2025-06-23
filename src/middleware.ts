import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Simple middleware that just passes through all requests
  return NextResponse.next();
}

// Specify which paths should trigger this middleware
export const config = {
  matcher: [
    // Skip these paths
    '/(api|_next/static|_next/image|favicon.ico)/(.*)',
    // Include these paths
    '/',
    '/billing/:path*',
    '/pricing/:path*',
    '/account/:path*'
  ],
};