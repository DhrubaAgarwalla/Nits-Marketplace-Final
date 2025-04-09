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
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Info as InfoIcon,
  WhatsApp as WhatsAppIcon,
  PhotoCamera as CameraIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { createItem, uploadItemImage } from '@/services/itemService';
import { ItemCategory, ListingType } from '@/types';

export default function CreateListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

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

  // Step state for multi-step form
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Info', 'Details', 'Images', 'Review'];

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
              Upload Images (max 5)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Good quality images increase your chances of selling quickly
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 3 }}>
              {previewUrls.map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 150,
                    height: 150,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
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
                      top: 5,
                      right: 5,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 0, 0, 0.1)',
                      },
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
                  startIcon={<CameraIcon />}
                  sx={{
                    width: 150,
                    height: 150,
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
              )}
            </Box>

            {previewUrls.length === 0 && (
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
              Review Your Listing
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

                {previewUrls.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Images:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {previewUrls.map((url, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Box>
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
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <UploadIcon />}
                  disabled={loading || success || !user}
                >
                  {loading ? 'Creating Listing...' : 'Create Listing'}
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
