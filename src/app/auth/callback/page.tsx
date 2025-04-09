'use client';

import { useEffect, useState, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Box, Typography, Button, Paper, CircularProgress, Container } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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
        // Get the code from the URL
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

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
          setError('No authentication code provided');
          setLoading(false);
          return;
        }

        // Log debugging information
        console.log('Auth callback processing started');
        console.log('Current URL:', window.location.href);
        console.log('Processing authentication code');

        try {
          // Clear any existing sessions to prevent conflicts
          console.log('Clearing existing sessions...');
          await supabase.auth.signOut({ scope: 'local' });
          console.log('Sessions cleared successfully');

          // Exchange the code for a session
          console.log('Exchanging code for session...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Error exchanging code for session:', error);
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
    <Suspense fallback={<AuthLoading />}>
      <CallbackHandler />
    </Suspense>
  );
}
