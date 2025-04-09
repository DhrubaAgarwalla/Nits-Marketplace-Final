'use client';

import { Box, Container, Typography, Grid as MuiGrid, Divider, Stack, IconButton } from '@mui/material';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, LinkedIn, School, Email, LocationOn } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[50],
        borderTop: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.03)',
      }}
    >
      <Container maxWidth="lg">
        <MuiGrid container spacing={4} justifyContent="space-between">
          <MuiGrid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  px: 1.5,
                  py: 0.5,
                  mr: 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  NITS
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  letterSpacing: '0.5px',
                }}
              >
                BAZAAR
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              A platform for NIT Silchar students to buy, sell, and rent items within the campus community.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton size="small" color="primary" aria-label="facebook">
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="twitter">
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="instagram">
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="linkedin">
                <LinkedIn fontSize="small" />
              </IconButton>
            </Stack>
          </MuiGrid>

          <MuiGrid item xs={12} sm={4}>
            <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box component="nav">
              <Box
                component={Link}
                href="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  mb: 1.5,
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s'
                }}
              >
                <Box component="span" sx={{ mr: 1, display: 'inline-block', width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%' }} />
                Home
              </Box>
              <Box
                component={Link}
                href="/browse"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  mb: 1.5,
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s'
                }}
              >
                <Box component="span" sx={{ mr: 1, display: 'inline-block', width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%' }} />
                Browse Items
              </Box>
              <Box
                component={Link}
                href="/create-listing"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  mb: 1.5,
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s'
                }}
              >
                <Box component="span" sx={{ mr: 1, display: 'inline-block', width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%' }} />
                Sell/Rent Item
              </Box>
            </Box>
          </MuiGrid>

          <MuiGrid item xs={12} sm={4}>
            <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
              <LocationOn fontSize="small" color="primary" sx={{ mr: 1, mt: 0.3 }} />
              <Typography variant="body2" color="text.secondary">
                National Institute of Technology Silchar<br />
                Silchar, Assam - 788010
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Email fontSize="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                dhrubagarwala67@gmail.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <School fontSize="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                NIT Silchar Campus
              </Typography>
            </Box>
          </MuiGrid>
        </MuiGrid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 0 },
            background: 'linear-gradient(90deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 100%)',
            px: 2,
            py: 1,
            borderRadius: 2,
          }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'medium',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                ©
              </Box>
              {new Date().getFullYear()}{' '}
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    color: 'white',
                    borderRadius: '4px',
                    px: 0.5,
                    mr: 0.5,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                  }}
                >
                  NITS
                </Box>
                <Box component="span" sx={{ fontWeight: 700 }}>BAZAAR</Box>
              </Box>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0.5 }}>
              All rights reserved
            </Typography>
            <Typography
              variant="body2"
              sx={{
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'medium',
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'rgba(25, 118, 210, 0.3)',
                borderRadius: 10,
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              ✨ Created by Team Namastute
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
