'use client';

import { useState, useEffect } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
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
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon,
  WhatsApp as WhatsAppIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { getItemById, updateItem, uploadItemImage } from '@/services/itemService';
import { ItemCategory, ListingType, Item } from '@/types';
import Link from 'next/link';

export default function EditListingPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const { id } = params;

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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Form submission state
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Step state for multi-step form
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Info', 'Details', 'Images', 'Review'];

  // Original item data for comparison
  const [originalItem, setOriginalItem] = useState<Item | null>(null);

  // Fetch the item data when the component mounts
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;

      try {
        const item = await getItemById(id);

        if (!item) {
          setError('Listing not found');
          setInitialLoading(false);
          return;
        }

        // Check if the current user is the owner of the item
        if (user && item.userId !== user.id) {
          setError('You do not have permission to edit this listing');
          setInitialLoading(false);
          return;
        }

        // Set the form state with the item data
        setTitle(item.title);
        setDescription(item.description);
        setPrice(item.price.toString());
        setCategory(item.category);
        setListingType(item.listingType);
        setCondition(item.condition || '');
        setExistingImages(item.images || []);

        // Set the original item for comparison
        setOriginalItem(item);

        // If the user has a WhatsApp number, use it
        if (item.user?.whatsappNumber) {
          setWhatsappNumber(item.user.whatsappNumber);
        }

        setInitialLoading(false);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load listing data. Please try again.');
        setInitialLoading(false);
      }
    };

    if (user) {
      fetchItem();
    } else {
      // Redirect if not logged in
      router.push('/auth/login');
    }
  }, [id, user, router]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Limit to 5 images total (existing + new)
      if (existingImages.length - imagesToDelete.length + files.length + selectedFiles.length > 5) {
        setError('You can upload a maximum of 5 images');
        return;
      }

      setFiles([...files, ...selectedFiles]);

      // Create preview URLs
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  // Remove new image
  const handleRemoveNewImage = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);

    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  // Toggle existing image for deletion
  const handleToggleExistingImage = (imageUrl: string) => {
    if (imagesToDelete.includes(imageUrl)) {
      // Remove from delete list
      setImagesToDelete(imagesToDelete.filter(url => url !== imageUrl));
    } else {
      // Add to delete list
      setImagesToDelete([...imagesToDelete, imageUrl]);
    }
  };

  // Handle next step
  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!title || !description) {
        setError('Please fill in all required fields in this step');
        return;
      }
    } else if (activeStep === 1) {
      if (!price || !category || !listingType) {
        setError('Please fill in all required fields in this step');
        return;
      }
    }

    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to update a listing');
      return;
    }

    if (!originalItem) {
      setError('Original listing data not found');
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
      console.log('Starting listing update process...');

      // Prepare the updated images array
      let updatedImages = [...existingImages.filter(url => !imagesToDelete.includes(url))];

      // Upload new images
      if (files.length > 0) {
        console.log(`Uploading ${files.length} new images...`);
        for (const file of files) {
          try {
            const imageUrl = await uploadItemImage(file, user.id);
            updatedImages.push(imageUrl);
          } catch (imageError: any) {
            console.error('Error uploading image:', imageError);
            throw new Error(`Failed to upload image: ${imageError.message}`);
          }
        }
      }

      // Create the update object
      const updates: Partial<Item> = {};

      // Only include fields that have changed
      if (title !== originalItem.title) updates.title = title;
      if (description !== originalItem.description) updates.description = description;
      if (numericPrice !== originalItem.price) updates.price = numericPrice;
      if (category !== originalItem.category) updates.category = category as ItemCategory;
      if (listingType !== originalItem.listingType) updates.listingType = listingType as ListingType;
      if (condition !== originalItem.condition) updates.condition = condition;

      // Always update images if there are changes
      if (JSON.stringify(updatedImages) !== JSON.stringify(originalItem.images)) {
        updates.images = updatedImages;
      }

      console.log('Updating item with data:', JSON.stringify(updates, null, 2));

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        try {
          const updatedItem = await updateItem(id, updates);
          console.log('Item updated successfully:', updatedItem);

          setSuccess(true);

          // Redirect to the item page after a short delay
          setTimeout(() => {
            router.push(`/items/${updatedItem.id}`);
          }, 1500);
        } catch (itemError: any) {
          console.error('Error in updateItem function:', itemError);
          setError(`Failed to update listing: ${itemError.message}`);
        }
      } else {
        console.log('No changes detected, skipping update');
        setSuccess(true);

        // Redirect to the item page after a short delay
        setTimeout(() => {
          router.push(`/items/${id}`);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error updating listing:', err);
      setError(`Failed to update listing: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Basic Info
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading || success}
                  placeholder="What are you selling/renting?"
                />
              </Grid>

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
                  placeholder="Provide details about your item..."
                  helperText="Be specific about the condition, features, and why someone would want it"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1: // Details
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Condition"
                  variant="outlined"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g., New, Used, Good condition"
                  disabled={loading || success}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="WhatsApp Number"
                  variant="outlined"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g., 919876543210 (with country code)"
                  helperText="This will be used for buyers to contact you directly"
                  disabled={loading || success}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WhatsAppIcon color="success" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2: // Images
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Manage Images (max 5)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Good quality images increase your chances of selling quickly
            </Typography>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Current Images
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  {existingImages.map((url, index) => (
                    <Box
                      key={`existing-${index}`}
                      sx={{
                        position: 'relative',
                        width: 150,
                        height: 150,
                        border: '1px solid',
                        borderColor: imagesToDelete.includes(url) ? 'error.main' : 'grey.300',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 1,
                        opacity: imagesToDelete.includes(url) ? 0.5 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        color={imagesToDelete.includes(url) ? "primary" : "error"}
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: imagesToDelete.includes(url) ? 'rgba(0, 0, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                          },
                        }}
                        onClick={() => handleToggleExistingImage(url)}
                        disabled={loading || success}
                      >
                        {imagesToDelete.includes(url) ? (
                          <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>UNDO</span>
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {/* New Images */}
            {previewUrls.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  New Images to Add
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  {previewUrls.map((url, index) => (
                    <Box
                      key={`new-${index}`}
                      sx={{
                        position: 'relative',
                        width: 150,
                        height: 150,
                        border: '1px solid',
                        borderColor: 'primary.light',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 1,
                      }}
                    >
                      <img
                        src={url}
                        alt={`New Image ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Chip
                        label="NEW"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          left: 5,
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 0, 0, 0.1)',
                          },
                        }}
                        onClick={() => handleRemoveNewImage(index)}
                        disabled={loading || success}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {/* Add Image Button */}
            {existingImages.length - imagesToDelete.length + previewUrls.length < 5 && (
              <Box sx={{ mt: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CameraIcon />}
                  sx={{
                    height: 150,
                    width: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2,
                    borderStyle: 'dashed',
                  }}
                  disabled={loading || success}
                >
                  Add Image
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    Click to browse
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageSelect}
                    multiple
                  />
                </Button>
              </Box>
            )}

            {imagesToDelete.length > 0 && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                {imagesToDelete.length} image(s) marked for deletion. These will be removed when you save changes.
              </Alert>
            )}

            {existingImages.length === 0 && previewUrls.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                You can add up to 5 images of your item
              </Alert>
            )}
          </Box>
        );

      case 3: // Review
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Changes
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">{title}</Typography>
                  <Chip
                    label={listingType}
                    color={listingType === ListingType.SELL ? 'primary' : listingType === ListingType.RENT ? 'secondary' : 'default'}
                    size="small"
                    sx={{ mt: 1, mr: 1 }}
                  />
                  <Chip
                    label={category}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ₹{price}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {description}
                  </Typography>
                </Grid>

                {condition && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Condition:</Typography>
                    <Typography variant="body2">{condition}</Typography>
                  </Grid>
                )}

                {whatsappNumber && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Contact:</Typography>
                    <Typography variant="body2">
                      <WhatsAppIcon fontSize="small" color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {whatsappNumber}
                    </Typography>
                  </Grid>
                )}

                {/* Display remaining images (not marked for deletion) */}
                {(existingImages.filter(url => !imagesToDelete.includes(url)).length > 0 || previewUrls.length > 0) && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Images:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {existingImages
                        .filter(url => !imagesToDelete.includes(url))
                        .map((url, index) => (
                          <Box
                            key={`review-existing-${index}`}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={url}
                              alt={`Image ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                        ))}

                      {previewUrls.map((url, index) => (
                        <Box
                          key={`review-new-${index}`}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '2px solid',
                            borderColor: 'primary.main',
                          }}
                        >
                          <img
                            src={url}
                            alt={`New Image ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                )}

                {imagesToDelete.length > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      {imagesToDelete.length} image(s) will be removed
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  if (initialLoading) {
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
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            component={Link}
            href="/my-listings"
            startIcon={<BackIcon />}
            sx={{ mr: 2 }}
          >
            Back to My Listings
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 4, my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Edit Listing
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Listing updated successfully! Redirecting...
            </Alert>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step content */}
          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || loading || success}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                  disabled={loading || success}
                >
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading || success}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
}
