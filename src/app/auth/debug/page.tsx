'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import MainLayout from '@/components/MainLayout';

export default function AuthDebugPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [envInfo, setEnvInfo] = useState<any>({});
  const [urlInfo, setUrlInfo] = useState<any>({});
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get current session
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
        } else {
          setSession(data.session);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred checking the session');
      } finally {
        setLoading(false);
      }
    };

    // Get environment info
    const getEnvironmentInfo = () => {
      setEnvInfo({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || 'Not set',
      });
    };

    // Get URL info
    const getUrlInfo = () => {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        setUrlInfo({
          origin: url.origin,
          hostname: url.hostname,
          pathname: url.pathname,
          protocol: url.protocol,
          isLocalhost: url.hostname === 'localhost',
          callbackUrl: `${url.origin}/auth/callback`,
        });
      }
    };

    checkSession();
    getEnvironmentInfo();
    getUrlInfo();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Error signing out');
      setLoading(false);
    }
  };

  const handleTestGoogleAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Clear any existing sessions to prevent conflicts
      await supabase.auth.signOut({ scope: 'local' });
      
      // Get the current URL information
      const currentUrl = new URL(window.location.href);
      const redirectUrl = `${currentUrl.origin}/auth/callback`;
      
      console.log('Starting Google auth with redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error in Google sign in:', err);
      setError(err.message || 'Error initiating Google sign in');
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Authentication Debug
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ my: 3 }}>
            <Typography variant="h6">Session Status</Typography>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, my: 1 }}>
              {session ? (
                <>
                  <Typography color="success.main">
                    ✅ Authenticated
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    User: {session.user?.email}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    onClick={handleSignOut}
                    sx={{ mt: 2 }}
                    disabled={loading}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Typography color="error">
                  ❌ Not authenticated
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">Environment Information</Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Supabase URL" 
                  secondary={envInfo.supabaseUrl} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Supabase Anon Key" 
                  secondary={envInfo.hasAnonKey ? "✅ Set" : "❌ Not set"} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Node Environment" 
                  secondary={envInfo.nodeEnv} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Vercel Environment" 
                  secondary={envInfo.vercelEnv} 
                />
              </ListItem>
            </List>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">URL Information</Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Origin" 
                  secondary={urlInfo.origin} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Hostname" 
                  secondary={urlInfo.hostname} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Is Localhost" 
                  secondary={urlInfo.isLocalhost ? "Yes" : "No"} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Callback URL" 
                  secondary={urlInfo.callbackUrl} 
                />
              </ListItem>
            </List>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">Authentication Tests</Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleTestGoogleAuth}
                disabled={loading}
                fullWidth
              >
                Test Google Authentication
              </Button>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                This will attempt to authenticate with Google and redirect to the callback URL.
              </Typography>
            </Box>
          </Box>
          
          <Alert severity="info" sx={{ mt: 4 }}>
            <Typography variant="body2">
              If you're experiencing authentication issues, make sure:
              <ul>
                <li>Your Supabase project has the correct Site URL and Redirect URLs configured</li>
                <li>Your Vercel project has the correct environment variables</li>
                <li>Your browser allows third-party cookies</li>
                <li>You're using a supported browser (Chrome, Firefox, Safari, Edge)</li>
              </ul>
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </MainLayout>
  );
}
