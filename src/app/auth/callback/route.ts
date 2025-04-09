import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Check if we already have an access_token in the URL
  // If so, we're in a redirect loop and need to break it
  if (requestUrl.toString().includes('access_token=')) {
    console.log('Detected access_token in URL, breaking potential redirect loop');
    // Redirect to home page without any parameters to break the loop
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }

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
  // Make sure to use a clean URL without any parameters
  const redirectUrl = new URL('/', siteUrl).toString();
  console.log('Redirecting to:', redirectUrl);

  return NextResponse.redirect(redirectUrl);
}
