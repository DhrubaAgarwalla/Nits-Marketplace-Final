'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { getUserById, updateUser } from '@/services/userService';
import { User, Item } from '@/types';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();

  // State for user profile
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [scholarId, setScholarId] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        setScholarId(userData.scholarId || '');
        setWhatsappNumber(userData.whatsappNumber || '');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser, router]);

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
        scholarId,
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
      <Container maxWidth="md">
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Paper elevation={3} sx={{
              p: 0,
              mb: 4,
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              {/* Profile Header with Background */}
              <Box sx={{
                position: 'relative',
                bgcolor: 'primary.main',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                height: 120,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid white',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    position: 'absolute',
                    top: 60,
                    bgcolor: 'primary.main',
                  }}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
                </Avatar>
              </Box>

              {/* Profile Info */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: 8,
                pb: 3,
                px: 3
              }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {user.fullName || 'NIT Silchar Student'}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {user.email}
                </Typography>

                {!isEditing && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      mt: 1,
                      borderRadius: 4,
                      px: 3,
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              <Divider />

              {isEditing ? (
                <Box component="form" onSubmit={handleSaveProfile} sx={{ p: 3 }}>
                  {saveError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {saveError}
                    </Alert>
                  )}

                  {saveSuccess && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                      Profile updated successfully!
                    </Alert>
                  )}

                  <Box sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                    border: '1px solid rgba(25, 118, 210, 0.1)'
                  }}>
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, color: 'primary.main' }}>
                      Personal Information
                    </Typography>

                    <TextField
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Department"
                      variant="outlined"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Scholar ID"
                      variant="outlined"
                      value={scholarId}
                      onChange={(e) => setScholarId(e.target.value)}
                      placeholder="e.g., 2101234"
                      helperText="Your NIT Silchar Scholar ID"
                      sx={{
                        mb: 0,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(76, 175, 80, 0.05)',
                    border: '1px solid rgba(76, 175, 80, 0.1)'
                  }}>
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, color: 'success.main' }}>
                      Contact Information
                    </Typography>

                    <TextField
                      fullWidth
                      label="WhatsApp Number"
                      variant="outlined"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g., 919876543210 (with country code)"
                      helperText="This will be used for buyers to contact you"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={saveLoading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                      disabled={saveLoading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      disabled={saveLoading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                  }}>
                    <Box sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <PersonIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Department
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.department || 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                  }}>
                    <Box sx={{
                      bgcolor: 'info.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Scholar ID
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.scholarId || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                  }}>
                    <Box sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        WhatsApp Contact
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.whatsappNumber || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                  }}>
                    <Box sx={{
                      bgcolor: 'warning.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
        </Box>
      </Container>
    </MainLayout>
  );
}
