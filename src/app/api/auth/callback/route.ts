import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the code from the URL
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    // If there's no code, redirect to home
    if (!code) {
      console.log('No code provided in callback, redirecting to home');
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }
    
    // Create a Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
    
    // Redirect to home page
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (error) {
    console.error('Error in auth callback:', error);
    
    // Even if there's an error, redirect to home
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    
    return NextResponse.redirect(url);
  }
}
