import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if this is an auth callback
  const isAuthCallback = req.nextUrl.pathname.startsWith('/auth/callback');

  if (isAuthCallback) {
    // For auth callbacks, just let them through without any redirects
    console.log('Auth callback detected, skipping middleware checks');
    return res;
  }

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Handle protected routes
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/create-listing') ||
                          req.nextUrl.pathname.startsWith('/profile') ||
                          req.nextUrl.pathname.startsWith('/my-listings') ||
                          req.nextUrl.pathname.includes('/items/') && req.nextUrl.pathname.endsWith('/edit');

  // If accessing a protected route without being logged in, redirect to login
  if (isProtectedRoute && !session) {
    console.log('Protected route accessed without session, redirecting to login');
    const redirectUrl = new URL('/auth/login', req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated, check if they have a valid NIT Silchar email
  if (session?.user) {
    const email = session.user.email;

    // If the email doesn't end with nits.ac.in, sign them out
    if (!email || !email.endsWith('nits.ac.in')) {
      console.log('Non-NIT Silchar email detected in middleware:', email);

      // Sign the user out
      await supabase.auth.signOut();

      // Redirect to the login page with an error message
      const url = new URL('/auth/login', req.nextUrl.origin);
      url.searchParams.set('error', 'Only NIT Silchar email addresses (.nits.ac.in) are allowed to use this platform.');

      return NextResponse.redirect(url);
    }
  }

  return res;
}

// Run the middleware on protected routes and auth callback
export const config = {
  matcher: [
    '/profile/:path*',
    '/my-listings/:path*',
    '/create-listing/:path*',
    '/items/:path*/edit',
    '/auth/callback',
  ],
};