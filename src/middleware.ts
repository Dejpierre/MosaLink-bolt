import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'your-supabase-url' &&
    supabaseAnonKey !== 'your-supabase-anon-key' &&
    supabaseUrl.startsWith('http')
  );
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  try {
    // Check if Supabase is configured before attempting to create client
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Skipping authentication middleware.');
      return NextResponse.next();
    }

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
    
    // Refresh session if expired
    await supabase.auth.getSession();
    
    // Continue with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If Supabase is not configured or any other error occurs, just continue without authentication
    return NextResponse.next();
  }
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