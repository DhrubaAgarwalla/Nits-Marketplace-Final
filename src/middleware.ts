import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is authenticated, check if they have a valid NIT Silchar email
  if (session?.user) {
    const email = session.user.email;

    // If the email doesn't end with nits.ac.in, sign them out
    if (!email || !email.endsWith('nits.ac.in')) {
      console.log('Non-NIT Silchar email detected in middleware:', email);

      // Sign the user out
      await supabase.auth.signOut();

      // Redirect to the login page with an error message
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('error', 'Only NIT Silchar email addresses (.nits.ac.in) are allowed to use this platform.');

      return NextResponse.redirect(url);
    }
  }

  return res;
}

// Only run the middleware on protected routes
export const config = {
  matcher: [
    '/profile/:path*',
    '/my-listings/:path*',
    '/create-listing/:path*',
    '/items/:path*/edit',
  ],
};