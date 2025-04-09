'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserById } from '@/services/userService';

export default function ProfileCompletionDialog() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check if user is logged in and we haven't checked yet
    if (user && !hasChecked) {
      const checkProfileCompletion = async () => {
        try {
          const userData = await getUserById(user.id);
          
          // Check if profile is incomplete (missing name, department, or scholar ID)
          const isProfileIncomplete = !userData.fullName || !userData.department || !userData.scholarId;
          
          if (isProfileIncomplete) {
            setOpen(true);
          }
          
          setHasChecked(true);
        } catch (error) {
          console.error('Error checking profile completion:', error);
          setHasChecked(true);
        }
      };

      checkProfileCompletion();
    }
  }, [user, hasChecked]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleGoToProfile = () => {
    router.push('/profile');
    setOpen(false);
  };

  if (!user || !open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="profile-completion-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="profile-completion-dialog-title">
        <Typography variant="h5" component="div" fontWeight="bold" color="primary">
          Complete Your Profile
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography paragraph>
            Welcome to NITS BAZAAR! Before you can create listings, please complete your profile information.
          </Typography>
          <Typography paragraph>
            Adding your details helps build trust with other users and makes transactions smoother.
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Required information:
            </Typography>
            <ul>
              <li>Full Name</li>
              <li>Department</li>
              <li>Scholar ID</li>
            </ul>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Later
        </Button>
        <Button 
          onClick={handleGoToProfile} 
          variant="contained" 
          color="primary"
          size="large"
        >
          Update Profile Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
