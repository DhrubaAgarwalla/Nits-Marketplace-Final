'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { getItemsByUserId, deleteItem } from '@/services/itemService';
import { Item, ListingType } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyListingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State for items
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs state
  const [tabValue, setTabValue] = useState(0);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const userItems = await getItemsByUserId(user.id);
        setItems(userItems);
        setFilteredItems(userItems);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load your listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user, router]);

  useEffect(() => {
    // Filter items based on selected tab
    if (tabValue === 0) {
      setFilteredItems(items);
    } else {
      const listingType =
        tabValue === 1 ? ListingType.SELL :
        tabValue === 2 ? ListingType.BUY :
        ListingType.RENT;

      setFilteredItems(items.filter(item => item.listingType === listingType));
    }
  }, [tabValue, items]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);

    try {
      await deleteItem(itemToDelete);

      // Remove the deleted item from the state
      setItems(items.filter(item => item.id !== itemToDelete));

      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete the listing. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Listings
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            href="/create-listing"
          >
            Create New Listing
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="All Listings" />
            <Tab label="Selling" />
            <Tab label="Buying" />
            <Tab label="Renting" />
          </Tabs>

          {filteredItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                You don't have any {tabValue === 0 ? '' : tabValue === 1 ? 'selling' : tabValue === 2 ? 'buying' : 'renting'} listings yet
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/create-listing"
                sx={{ mt: 2 }}
              >
                Create a Listing
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ width: '100%', maxWidth: '100%' }}>
              {filteredItems.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} sx={{ maxWidth: '100%' }}>
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
                      padding: '16px',
                    }
                  }}>
                    {item.images && item.images.length > 0 ? (
                      <CardMedia
                        component="img"
                        height="160"
                        image={item.images[0]}
                        alt={item.title}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 160,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.light',
                          color: 'white',
                          fontSize: '3rem'
                        }}
                      >
                        {item.category === 'Lab Equipment' ? '🧪' :
                         item.category === 'Books/Notes' ? '📚' :
                         item.category === 'Furniture' ? '🪑' :
                         item.category === 'Electronics' ? '💻' :
                         item.category === 'Tickets' ? '🎫' : '🛍️'}
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h2" sx={{
                          maxWidth: '70%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word'
                        }}>
                          {item.title}
                        </Typography>
                        <Chip
                          label={getListingTypeLabel(item.listingType)}
                          color={getListingTypeColor(item.listingType)}
                          size="small"
                        />
                      </Box>

                      <Typography variant="h6" color="primary.main" gutterBottom>
                        {formatPrice(item.price)}
                        {item.listingType === ListingType.RENT && <span style={{ fontSize: '0.8rem' }}> /month</span>}
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
                          {/* Limit to approximately 5-6 words per line */}
                          {item.description.split(' ').slice(0, 20).map((word, index) => {
                            // Add a line break after every 5th word
                            if (index > 0 && index % 5 === 0) {
                              return <React.Fragment key={index}><br />{word} </React.Fragment>;
                            }
                            return <React.Fragment key={index}>{word} </React.Fragment>;
                          })}
                          {item.description.split(' ').length > 20 && '...'}
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary" display="block">
                        Posted: {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <IconButton
                        component={Link}
                        href={`/items/${item.id}`}
                        color="primary"
                        aria-label="view"
                      >
                        <ViewIcon />
                      </IconButton>

                      <IconButton
                        component={Link}
                        href={`/edit-listing/${item.id}`}
                        color="secondary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this listing? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={20} />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
