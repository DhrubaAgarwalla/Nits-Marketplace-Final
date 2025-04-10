'use client';

import { useState, useEffect, Suspense } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Google as GoogleIcon, Email as EmailIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/MainLayout';

// Component that uses searchParams
function LoginContent() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();

  // Check for error message in URL (from middleware)
  useEffect(() => {
    const errorMsg = searchParams.get('error');
    if (errorMsg) {
      setMessage({
        type: 'error',
        text: errorMsg
      });
    }
  }, [searchParams]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validate Institute email - accept both nits.ac.in and any subdomain of nits.ac.in
      if (!email.endsWith('nits.ac.in') && !email.includes('@') || !email.split('@')[1].endsWith('nits.ac.in')) {
        setMessage({
          type: 'error',
          text: 'Please use your Institute email address (ending with nits.ac.in or any subdomain)',
        });
        setIsLoading(false);
        return;
      }

      await signIn(email);
      setMessage({
        type: 'success',
        text: 'Check your email for a login link!',
      });
    } catch (error) {
      console.error('Error during sign in:', error);
      setMessage({
        type: 'error',
        text: 'Failed to sign in. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await signInWithGoogle();
      // The redirect will happen automatically
    } catch (error) {
      console.error('Error during Google sign in:', error);
      setMessage({
        type: 'error',
        text: 'Failed to sign in with Google. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Use your Institute email to access the marketplace
          </Typography>

          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleEmailSignIn} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Institute Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your.name@nits.ac.in"
              required
              sx={{ mb: 2 }}
              disabled={isLoading}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <EmailIcon />}
            >
              {isLoading ? 'Sending Link...' : 'Sign in with Institute Email'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            * Only Institute emails ending with nits.ac.in or any subdomain (e.g., civil.nits.ac.in) are allowed
          </Typography>
        </Paper>
      </Container>
    </MainLayout>
  );
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<MainLayout><Container maxWidth="sm"><CircularProgress /></Container></MainLayout>}>
      <LoginContent />
    </Suspense>
  );
}
