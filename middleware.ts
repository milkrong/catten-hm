import { updateSession } from '@/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  // update user's auth session
  const response = await updateSession(request);
  console.log(response.status);
  if (response.status !== 200) {
    // Redirect to login if user is not authenticated
    if (path !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    if (path === '/login' || path === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
