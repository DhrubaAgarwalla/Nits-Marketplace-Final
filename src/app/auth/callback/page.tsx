'use client';

import { useEffect, useState, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Box, Typography, Button, Paper, CircularProgress, Container } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';

// Create a component that uses the searchParams
function CallbackHandler() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  // Rest of the component remains the same

  useEffect(() => {
    const processCode = async () => {
      try {
        // Log the full URL for debugging
        console.log('Full callback URL:', window.location.href);

        // Check if we have a hash fragment
        const hashFragment = window.location.hash ? window.location.hash.substring(1) : '';
        console.log('Hash fragment present:', !!hashFragment);

        // Special handling for access_token in hash (implicit flow)
        if (hashFragment && hashFragment.includes('access_token=')) {
          console.log('Detected access_token in hash fragment - using implicit flow');

          try {
            // This is the implicit flow - we need to set the session directly
            const { data, error } = await supabase.auth.getSession();

            if (error) {
              throw error;
            }

            if (data.session) {
              console.log('Session already established');
              setSuccess(true);
              setLoading(false);

              // Redirect to home page
              setTimeout(() => {
                window.location.href = '/';
              }, 2000);
              return;
            } else {
              // Try to set the session from the hash
              console.log('Setting session from hash');
              const { error: setSessionError } = await supabase.auth.setSession(hashFragment);

              if (setSessionError) {
                throw setSessionError;
              }

              setSuccess(true);
              setLoading(false);

              // Redirect to home page
              setTimeout(() => {
                window.location.href = '/';
              }, 2000);
              return;
            }
          } catch (sessionError: any) {
            console.error('Error setting session from hash:', sessionError);
            setError(`Session error: ${sessionError.message}`);
            setLoading(false);
            return;
          }
        }

        // Standard authorization code flow
        // Check if we have a hash fragment that might contain the code
        const hashParams = new URLSearchParams(hashFragment);

        // Try to get code from query params first, then from hash if not found
        let code = searchParams.get('code');
        let errorParam = searchParams.get('error');
        let errorDescription = searchParams.get('error_description');

        // If not in query params, try the hash fragment
        if (!code && hashParams.has('code')) {
          code = hashParams.get('code');
          console.log('Found code in hash fragment');
        }

        if (!errorParam && hashParams.has('error')) {
          errorParam = hashParams.get('error');
          errorDescription = hashParams.get('error_description');
        }

        // Check for error parameters first
        if (errorParam) {
          const errorMessage = errorDescription || `Authentication error: ${errorParam}`;
          console.error('Error in auth callback URL:', errorMessage);
          setError(errorMessage);
          setLoading(false);
          return;
        }

        // If there's no code, show an error
        if (!code) {
          setError('No authentication code provided. Check URL format.');
          setLoading(false);
          return;
        }

        // Log debugging information
        console.log('Auth callback processing started');
        console.log('Current URL:', window.location.href);
        console.log('Processing authentication code');

        try {
          // Don't clear existing sessions here - it might be causing issues
          // Just try to exchange the code for a session directly
          console.log('Exchanging code for session...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Error exchanging code for session:', error);

            // If we get an error, try to get the session directly as a fallback
            console.log('Trying to get session as fallback...');
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
              throw sessionError;
            }

            if (sessionData.session) {
              // We have a session despite the error, so we can proceed
              console.log('Session found despite exchange error');
              setSuccess(true);
              setLoading(false);

              // Redirect to home page
              console.log('Redirecting to home page in 2 seconds...');
              setTimeout(() => {
                window.location.href = '/';
              }, 2000);
              return;
            }

            // If we still don't have a session, show the error
            setError(`Authentication error: ${error.message}`);
            setLoading(false);
            return;
          }

          // Log session data (without sensitive info)
          console.log('Session exchange successful:', data.session ? 'Session obtained' : 'No session returned');

          // Success!
          console.log('Successfully authenticated');
          setSuccess(true);
          setLoading(false);

          // Use window.location instead of router to avoid potential redirect issues
          console.log('Redirecting to home page in 2 seconds...');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } catch (sessionError: any) {
          console.error('Error during session exchange:', sessionError);
          setError(`Session error: ${sessionError.message || 'Unknown session error'}`);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Unexpected error in auth callback:', err);
        setError(`Unexpected error: ${err.message || 'An unknown error occurred'}`);
        setLoading(false);
      }
    };

    // Only process the code if we're loading
    if (loading) {
      processCode();
    }
  }, [searchParams, loading, supabase.auth]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Authentication
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <>
            <Typography color="error" variant="h6" align="center" gutterBottom>
              Authentication Failed
            </Typography>
            <Typography color="error" align="center" paragraph>
              {error}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                component={Link}
                href="/auth/login"
              >
                Back to Login
              </Button>
              <Button
                variant="outlined"
                component={Link}
                href="/auth/debug"
                color="info"
              >
                Debug Authentication
              </Button>
            </Box>
          </>
        )}

        {success && (
          <>
            <Typography color="success.main" variant="h6" align="center" gutterBottom>
              Authentication Successful!
            </Typography>
            <Typography align="center" paragraph>
              You have been successfully authenticated. You will be redirected to the home page in a few seconds.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                component={Link}
                href="/"
              >
                Go to Home Page
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

// Loading component for Suspense fallback
function AuthLoading() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Authentication
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
        <Typography align="center">
          Processing your authentication...
        </Typography>
      </Paper>
    </Container>
  );
}

// Main component that wraps CallbackHandler in Suspense
export default function AuthCallbackPage() {
  return (
    <>
      {/* Include the access token handler script */}
      <Script
        src="/auth/callback/access-token-handler.js"
        strategy="beforeInteractive"
      />
      <Suspense fallback={<AuthLoading />}>
        <CallbackHandler />
      </Suspense>
    </>
  );
}
