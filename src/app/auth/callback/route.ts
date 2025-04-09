import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Determine if we're on Vercel or localhost
  const isVercel = requestUrl.hostname.includes('vercel.app');

  // Use Vercel URL for production, request origin for local development
  const siteUrl = isVercel
    ? 'https://nits-marketplace-final.vercel.app'
    : requestUrl.origin;

  console.log('Callback processing with URL:', requestUrl.toString());
  console.log('Using site URL for redirect:', siteUrl);

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      await supabase.auth.exchangeCodeForSession(code);

      // Log successful authentication
      console.log('Successfully authenticated with code');
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      // Still redirect to home page even if there's an error
    }
  }

  // Redirect to the appropriate URL based on environment
  const redirectUrl = `${siteUrl}/`;
  console.log('Redirecting to:', redirectUrl);

  return NextResponse.redirect(redirectUrl);
}
