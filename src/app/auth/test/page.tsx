'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';

export default function AuthTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Get the current URL information
      const currentUrl = new URL(window.location.href);
      
      // Log the URL for debugging
      console.log('Current URL:', currentUrl.toString());
      
      // Use the API route for callback
      const redirectUrl = `${currentUrl.origin}/api/auth/callback`;
      console.log('Using API route for redirect URL:', redirectUrl);
      
      // Attempt to sign in with Google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Restrict to NIT Silchar domain
            hd: 'nits.ac.in',
          },
          redirectTo: redirectUrl,
        },
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Redirecting to Google...');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setSuccess('Signed out successfully');
      setSession(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Auth Test Page
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Environment Info:</Typography>
          <Typography>Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'Server-side'}</Typography>
          <Typography>Origin: {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</Typography>
        </Box>
        
        {session ? (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" color="success.main">Currently signed in</Typography>
            <Typography>User: {session.user?.email}</Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleSignOut}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Out'}
            </Button>
          </Box>
        ) : (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" color="error.main">Not signed in</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign in with Google'}
            </Button>
          </Box>
        )}
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            Error: {error}
          </Typography>
        )}
        
        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
