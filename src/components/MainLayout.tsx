'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mounted, setMounted] = useState(false);

  // Only render the component after it's mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a simple layout for server-side rendering
  if (!mounted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container component="main" sx={{ flexGrow: 1, py: 4 }} maxWidth="lg">
          {/* Empty container for SSR */}
        </Container>
      </Box>
    );
  }

  // Full layout for client-side rendering
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      // Improve mobile performance by setting overflow-x to hidden
      overflowX: 'hidden',
    }}>
      <Navbar />
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
        maxWidth="lg"
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
