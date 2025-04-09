'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Container, Typography } from '@mui/material';

export default function AuthIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Typography variant="h4">NITS BAZAAR Authentication</Typography>
        <CircularProgress />
        <Typography>Redirecting to login page...</Typography>
      </Box>
    </Container>
  );
}
