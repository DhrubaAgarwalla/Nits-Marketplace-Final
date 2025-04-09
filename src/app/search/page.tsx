'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import MainLayout from '@/components/MainLayout';

export default function SearchPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to browse page which has search functionality
    router.push('/browse');
  }, [router]);

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '50vh' 
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6">
            Redirecting to search...
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
}
