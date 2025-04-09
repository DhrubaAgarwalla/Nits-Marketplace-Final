'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { createItem, uploadItemImage } from '@/services/itemService';
import { ItemCategory, ListingType } from '@/types';

export default function CreateListingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ItemCategory | ''>('');
  const [listingType, setListingType] = useState<ListingType | ''>('');
  const [condition, setCondition] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Image upload state
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Form submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Limit to 5 images total
      if (files.length + selectedFiles.length > 5) {
        setError('You can upload a maximum of 5 images');
        return;
      }

      setFiles([...files, ...selectedFiles]);

      // Create preview URLs
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);

    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a listing');
      return;
    }

    // Validate form
    if (!title || !description || !price || !category || !listingType) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate price is a number
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      setError('Price must be a valid number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting listing creation process...');
      console.log('User ID:', user.id);

      // Upload images first
      const imageUrls = [];

      if (files.length > 0) {
        console.log(`Uploading ${files.length} images...`);
        for (const file of files) {
          try {
            const imageUrl = await uploadItemImage(file, user.id);
            imageUrls.push(imageUrl);
          } catch (imageError) {
            console.error('Error uploading image:', imageError);
            throw new Error(`Failed to upload image: ${imageError.message}`);
          }
        }
      }

      // Create the item
      const newItem = {
        title,
        description,
        price: numericPrice,
        category: category as ItemCategory,
        listingType: listingType as ListingType,
        condition: condition || undefined,
        images: imageUrls,
        userId: user.id,
      };

      console.log('Creating item with data:', JSON.stringify(newItem, null, 2));

      try {
        const createdItem = await createItem(newItem);
        console.log('Item created successfully:', createdItem);

        // Update user's WhatsApp number if provided
        if (whatsappNumber) {
          // This would be handled by a user service
          // await updateUser(user.id, { whatsappNumber });
        }

        setSuccess(true);

        // Redirect to the item page after a short delay
        setTimeout(() => {
          router.push(`/items/${createdItem.id}`);
        }, 1500);
      } catch (itemError) {
        console.error('Error in createItem function:', itemError);
        setError(`Failed to create listing: ${itemError.message}`);
      }
    } catch (err: any) {
      console.error('Error creating listing:', err);
      setError(`Failed to create listing: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create New Listing
          </Typography>

          {!user && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              You need to be logged in to create a listing.
              Please <Button href="/auth/login">sign in</Button> first.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Listing created successfully! Redirecting...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading || success}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  required
                  disabled={loading || success}
                />
              </Grid>

              {/* Price */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  variant="outlined"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  required
                  disabled={loading || success}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    label="Category"
                    disabled={loading || success}
                  >
                    {Object.values(ItemCategory).map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Listing Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Listing Type</InputLabel>
                  <Select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as ListingType)}
                    label="Listing Type"
                    disabled={loading || success}
                  >
                    <MenuItem value={ListingType.SELL}>I want to sell</MenuItem>
                    <MenuItem value={ListingType.BUY}>I want to buy</MenuItem>
                    <MenuItem value={ListingType.RENT}>I want to rent out</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Condition */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Condition (optional)"
                  variant="outlined"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g., New, Used, Good condition"
                  disabled={loading || success}
                />
              </Grid>

              {/* WhatsApp Number */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="WhatsApp Number (for contact)"
                  variant="outlined"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g., 919876543210 (with country code)"
                  helperText="This will be used for buyers to contact you directly"
                  disabled={loading || success}
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Images (max 5)
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  {previewUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bgcolor: 'rgba(255, 255, 255, 0.7)',
                        }}
                        onClick={() => handleRemoveImage(index)}
                        disabled={loading || success}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}

                  {previewUrls.length < 5 && (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      sx={{
                        width: 100,
                        height: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      disabled={loading || success}
                    >
                      Add Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageSelect}
                        multiple
                      />
                    </Button>
                  )}
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <UploadIcon />}
                  disabled={loading || success || !user}
                >
                  {loading ? 'Creating Listing...' : 'Create Listing'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
}
