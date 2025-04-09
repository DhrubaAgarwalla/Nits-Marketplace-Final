import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the URL and code
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    // Log the full URL for debugging
    console.log('Full callback URL:', requestUrl.toString());

    // Check for redirect loops
    if (requestUrl.searchParams.has('access_token')) {
      console.log('Breaking redirect loop - access_token detected');
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }

    // If there's no code, redirect to home
    if (!code) {
      console.log('No code provided in callback, redirecting to home');
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }

    // Process the authentication code
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent('Authentication failed')}`, requestUrl.origin)
      );
    }

    console.log('Successfully authenticated with code');

    // Redirect to home page with success parameter
    return NextResponse.redirect(
      new URL('/', requestUrl.origin)
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error in auth callback:', error);

    // Safely redirect to home
    const origin = request.headers.get('host') || 'nits-marketplace-final.vercel.app';
    const protocol = origin.includes('localhost') ? 'http' : 'https';

    return NextResponse.redirect(`${protocol}://${origin}/`);
  }
}
