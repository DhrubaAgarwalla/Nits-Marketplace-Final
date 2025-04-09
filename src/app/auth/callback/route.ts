import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Get the site URL from the request or environment variable
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

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

  // Always redirect to the site URL, not localhost
  // This ensures it works on both local and production environments
  return NextResponse.redirect(`${siteUrl}/`);
}
