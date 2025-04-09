'use client';

import { Box, Container, Typography, Link as MuiLink, Grid, Divider } from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              NIT Silchar Marketplace
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A platform for NIT Silchar students to buy, sell, and rent items within the campus community.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" component={Link} href="/" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Home
            </Typography>
            <Typography variant="body2" component={Link} href="/browse" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Browse Items
            </Typography>
            <Typography variant="body2" component={Link} href="/create-listing" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Sell/Rent Item
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              National Institute of Technology Silchar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Silchar, Assam - 788010
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@nitmarketplace.com
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' NIT Silchar Marketplace. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
}
