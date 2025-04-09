'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Avatar, 
  Divider, 
  CircularProgress, 
  Alert, 
  Tabs, 
  Tab 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Save as SaveIcon, 
  Edit as EditIcon 
} from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { getUserById, updateUser } from '@/services/userService';
import { getItemsByUserId } from '@/services/itemService';
import { User, Item } from '@/types';
import ItemCard from '@/components/ItemCard';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  
  // State for user profile
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Tabs state
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!authUser) {
      router.push('/auth/login');
      return;
    }
    
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user profile
        const userData = await getUserById(authUser.id);
        setUser(userData);
        
        // Set form values
        setFullName(userData.fullName || '');
        setDepartment(userData.department || '');
        setWhatsappNumber(userData.whatsappNumber || '');
        
        // Fetch user's items
        const userItems = await getItemsByUserId(authUser.id);
        setItems(userItems);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [authUser, router]);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authUser) return;
    
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const updatedUser = await updateUser(authUser.id, {
        fullName,
        department,
        whatsappNumber,
      });
      
      setUser(updatedUser);
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Reset success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
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
  
  if (error || !user) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: 'center', my: 4 }}>
            <Typography variant="h5" color="error" gutterBottom>
              {error || 'Profile not found'}
            </Typography>
            <Button variant="contained" onClick={() => router.push('/')} sx={{ mt: 2 }}>
              Go to Home
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
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
                </Avatar>
                
                <Typography variant="h5" gutterBottom>
                  {user.fullName || 'NIT Silchar Student'}
                </Typography>
                
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
                
                {!isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {isEditing ? (
                <Box component="form" onSubmit={handleSaveProfile}>
                  {saveError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {saveError}
                    </Alert>
                  )}
                  
                  {saveSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Profile updated successfully!
                    </Alert>
                  )}
                  
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Department"
                    variant="outlined"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    variant="outlined"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g., 919876543210 (with country code)"
                    helperText="This will be used for buyers to contact you"
                    sx={{ mb: 3 }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={saveLoading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                      disabled={saveLoading}
                      fullWidth
                    >
                      Save
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      disabled={saveLoading}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.department || 'Not specified'}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    WhatsApp Contact
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user.whatsappNumber || 'Not provided'}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Listings Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                My Listings
              </Typography>
              
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="All" />
                <Tab label="Selling" />
                <Tab label="Buying" />
                <Tab label="Renting" />
              </Tabs>
              
              {items.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    You don't have any listings yet
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/create-listing"
                    sx={{ mt: 2 }}
                  >
                    Create Your First Listing
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {items.map((item) => (
                    <Grid item key={item.id} xs={12} sm={6}>
                      <ItemCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
