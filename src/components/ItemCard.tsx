'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  CardActionArea,
  CardActions
} from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { Item, ListingType } from '@/types';
import Link from 'next/link';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { id, title, description, price, category, listingType, images, user } = item;

  // Format price display
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

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

  // Open WhatsApp chat
  const openWhatsAppChat = () => {
    if (user?.whatsappNumber) {
      const message = `Hi, I'm interested in your listing "${title}" on NIT Marketplace.`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${user.whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      width: '100%',
      // Set a fixed width to prevent expansion
      '& .MuiCardContent-root': {
        width: '100%',
        boxSizing: 'border-box',
        padding: { xs: '12px', sm: '16px' },
      },
      // Optimize for mobile
      '@media (max-width: 600px)': {
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }
    }}>
      <CardActionArea component={Link} href={`/items/${id}`}>
        {images && images.length > 0 ? (
          <CardMedia
            component="img"
            sx={{
              height: { xs: '180px', sm: '200px' },
              objectFit: 'cover',
              objectPosition: 'center',
              '@media (max-width: 600px)': {
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }
            }}
            image={images[0]}
            alt={title}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.light',
              color: 'white',
              fontSize: '4rem'
            }}
          >
            {category === 'Lab Equipment' ? '🧪' :
             category === 'Books/Notes' ? '📚' :
             category === 'Furniture' ? '🪑' :
             category === 'Electronics' ? '💻' :
             category === 'Tickets' ? '🎫' : '🛍️'}
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{
              maxWidth: '70%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word'
            }}>
              {title}
            </Typography>
            <Chip
              label={getListingTypeLabel(listingType)}
              color={getListingTypeColor(listingType)}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>

          <Typography variant="h5" color="primary.main" gutterBottom>
            {formattedPrice}
            {listingType === ListingType.RENT && <span style={{ fontSize: '0.8rem' }}> /month</span>}
          </Typography>

          <Box sx={{
            width: '100%',
            overflow: 'hidden',
            // Set a fixed width to prevent expansion
            maxWidth: '240px'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{
              mb: 1,
              height: '3em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word',
              wordWrap: 'break-word',
              hyphens: 'auto',
              width: '100%',
              maxWidth: '100%'
            }}>
              {/* Limit to approximately 5-6 words per line by adding spaces */}
              {description.split(' ').map((word, index) => {
                // Add a line break after every 5th word
                if (index > 0 && index % 5 === 0) {
                  return <React.Fragment key={index}><br />{word} </React.Fragment>;
                }
                return <React.Fragment key={index}>{word} </React.Fragment>;
              })}
            </Typography>
          </Box>

          <Chip
            label={category}
            size="small"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </CardContent>
      </CardActionArea>

      {user?.whatsappNumber && (
        <CardActions>
          <Button
            startIcon={<WhatsAppIcon />}
            variant="outlined"
            color="success"
            fullWidth
            onClick={openWhatsAppChat}
          >
            Contact Seller
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
