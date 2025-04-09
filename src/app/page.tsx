'use client';

import MainLayout from '@/components/MainLayout';
import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material';
import { ItemCategory } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './home.module.css';

export default function Home() {
  // State to handle client-side rendering
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Featured categories with icons
  const categories = [
    { name: ItemCategory.LAB_EQUIPMENT, icon: '🧪', description: 'Lab equipment and supplies' },
    { name: ItemCategory.BOOKS, icon: '📚', description: 'Textbooks, notes, and study materials' },
    { name: ItemCategory.FURNITURE, icon: '🪑', description: 'Furniture for your hostel room' },
    { name: ItemCategory.ELECTRONICS, icon: '💻', description: 'Laptops, phones, and other electronics' },
    { name: ItemCategory.TICKETS, icon: '🎫', description: 'Event tickets and passes' },
    { name: ItemCategory.MISCELLANEOUS, icon: '🛍️', description: 'Other useful items' },
  ];

  // If not client-side yet, return a simple loading state or null
  if (!isClient) {
    return null;
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        {/* Background image */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Image
            src="/header.jpg"
            alt="NIT Silchar Campus"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(1.1) contrast(1.1)'
            }}
            priority
            quality={100}
          />
        </div>
        {/* Overlay */}
        <div className={styles.heroOverlay} />
        <Container maxWidth="md" className={styles.heroContent}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '0.02em',
              mb: 2
            }}
          >
            NIT Silchar Marketplace
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.4
            }}
          >
            Buy, sell, and rent items within the NIT Silchar community
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              href="/browse"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Browse Items
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/create-listing"
              sx={{
                px: 4,
                py: 1.5,
                color: 'white',
                borderColor: 'white',
                borderWidth: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Sell or Rent Item
            </Button>
          </Box>
        </Container>
      </div>

      {/* Categories Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Browse by Category
        </Typography>
        <div className={styles.gridContainer}>
          {categories.map((category) => (
            <div key={category.name} className={styles.gridItem}>
              <Link href={`/browse?category=${category.name}`} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    bgcolor: 'primary.light',
                    color: 'white',
                    fontSize: '3rem',
                  }}
                >
                  {category.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
              </Link>
            </div>
          ))}
        </div>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          How It Works
        </Typography>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h1" color="primary" sx={{ mb: 2 }}>1</Typography>
              <Typography variant="h6" gutterBottom>Sign Up with NIT Email</Typography>
              <Typography variant="body1">Create an account using your NIT Silchar email address</Typography>
            </Box>
          </div>
          <div className={styles.gridItem}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h1" color="primary" sx={{ mb: 2 }}>2</Typography>
              <Typography variant="h6" gutterBottom>Create a Listing</Typography>
              <Typography variant="body1">List items you want to sell, buy, or rent with photos and details</Typography>
            </Box>
          </div>
          <div className={styles.gridItem}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h1" color="primary" sx={{ mb: 2 }}>3</Typography>
              <Typography variant="h6" gutterBottom>Connect & Exchange</Typography>
              <Typography variant="body1">Chat with other students via WhatsApp and complete your transaction</Typography>
            </Box>
          </div>
        </div>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          p: 6,
          borderRadius: 4,
          bgcolor: 'primary.main',
          textAlign: 'center',
          mb: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          color="white"
          sx={{
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          Ready to buy or sell on campus?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }} color="white">
          Join the NIT Silchar Marketplace community today!
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/auth/login"
          sx={{
            px: 4,
            py: 1.5,
            bgcolor: 'white',
            color: 'primary.dark',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#f0f0f0',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Get Started
        </Button>
      </Box>
    </MainLayout>
  );
}
