'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import { getItemById } from '@/services/itemService';
import { Item, ListingType, PriceType } from '@/types';
import ExternalImage from '@/components/ExternalImage';
import Link from 'next/link';

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getItemById(id as string);
        setItem(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get listing type label
  const getListingTypeLabel = (type: ListingType) => {
    switch (type) {
      case ListingType.SELL:
        return 'For Sale';
      case ListingType.BUY:
        return 'Wanted';
      case ListingType.RENT:
        return 'For Rent';
      default:
        return type;
    }
  };

  // Get listing type color
  const getListingTypeColor = (type: ListingType) => {
    switch (type) {
      case ListingType.SELL:
        return 'primary';
      case ListingType.BUY:
        return 'success';
      case ListingType.RENT:
        return 'warning';
      default:
        return 'default';
    }
  };

  // Open WhatsApp chat
  const openWhatsAppChat = () => {
    if (item?.user?.whatsappNumber) {
      const message = `Hi, I'm interested in your listing "${item.title}" on NIT Marketplace.`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${item.user.whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error || !item) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: 'center', my: 4 }}>
            <Typography variant="h5" color="error" gutterBottom>
              {error || 'Item not found'}
            </Typography>
            <Button component={Link} href="/browse" variant="contained" sx={{ mt: 2 }}>
              Browse Other Items
            </Button>
          </Paper>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left column - Images */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  height: 400,
                  width: '100%',
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                {selectedImage ? (
                  <ExternalImage
                    src={selectedImage}
                    alt={item.title}
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      bgcolor: 'primary.light',
                      color: 'white',
                      fontSize: '8rem'
                    }}
                  >
                    {item.category === 'Lab Equipment' ? '🧪' :
                     item.category === 'Books/Notes' ? '📚' :
                     item.category === 'Furniture' ? '🪑' :
                     item.category === 'Electronics' ? '💻' :
                     item.category === 'Tickets' ? '🎫' : '🛍️'}
                  </Box>
                )}
              </Box>

              {/* Thumbnail images */}
              {item.images && item.images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
                  {item.images.map((img, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      sx={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: img === selectedImage ? '2px solid' : '1px solid',
                        borderColor: img === selectedImage ? 'primary.main' : 'grey.300',
                      }}
                    >
                      <ExternalImage
                        src={img}
                        alt={`${item.title} - image ${index + 1}`}
                        style={{ objectFit: 'cover' }}
                        onClick={() => setSelectedImage(img)}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right column - Item details */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {item.title}
                </Typography>
                <Chip
                  label={getListingTypeLabel(item.listingType)}
                  color={getListingTypeColor(item.listingType)}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h3" color="primary.main">
                  {formatPrice(item.price)}
                  {item.listingType === ListingType.RENT && <span style={{ fontSize: '1rem' }}> /month</span>}
                </Typography>
                <Chip
                  label={item.priceType === PriceType.FIXED ? 'Fixed Price' : 'Negotiable'}
                  color={item.priceType === PriceType.FIXED ? 'default' : 'info'}
                  size="medium"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Category: <Chip label={item.category} size="small" sx={{ ml: 1 }} />
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Posted on {formatDate(item.createdAt)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {item.description}
              </Typography>

              {item.condition && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Condition
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {item.condition}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Seller information */}
              <Typography variant="h6" gutterBottom>
                Seller Information
              </Typography>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {item.user?.fullName || 'NIT Silchar Student'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.user?.department || 'Department not specified'}
                      </Typography>
                      {item.user?.scholarId && (
                        <Typography variant="body2" color="text.secondary">
                          Scholar ID: {item.user.scholarId}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Contact button */}
              {item.user?.whatsappNumber ? (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  onClick={openWhatsAppChat}
                  sx={{ mt: 2 }}
                >
                  Contact via WhatsApp
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Seller has not provided contact information
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Related items would go here */}
      </Container>
    </MainLayout>
  );
}
