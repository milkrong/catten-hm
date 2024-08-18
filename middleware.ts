import { updateSession } from '@/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  // update user's auth session
  const response = await updateSession(request);

  const isAuthenticated =
    response.headers.get('X-User-Authenticated') === 'true';

  if (isAuthenticated) {
    // User is authenticated
    if (path === '/login') {
      // Redirect authenticated users away from login page
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // For authenticated users, allow access to all other pages
    return response;
  } else {
    // User is not authenticated
    if (path !== '/login' && path !== '/' && path !== '/sign-up') {
      // Redirect unauthenticated users to login page, except for home page
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to login and home page for unauthenticated users
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
