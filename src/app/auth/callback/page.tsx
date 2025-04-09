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

        // If there's no code, show an error
        if (!code) {
          setError('No authentication code provided');
          setLoading(false);
          return;
        }

        // Log the code for debugging
        console.log('Processing authentication code');

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('Error exchanging code for session:', error);
          setError(error.message);
          setLoading(false);
          return;
        }

        // Success!
        console.log('Successfully authenticated');
        setSuccess(true);
        setLoading(false);

        // Automatically redirect after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } catch (err: any) {
        console.error('Unexpected error in auth callback:', err);
        setError(err.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    processCode();
  }, [searchParams, router, supabase.auth]);

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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                component={Link}
                href="/auth/login"
              >
                Back to Login
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
