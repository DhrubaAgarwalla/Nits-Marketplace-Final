'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleProfileMenuClose();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { text: 'Home', href: '/' },
    { text: 'Browse', href: '/browse' },
    { text: 'Sell/Rent', href: '/create-listing' },
  ];

  const drawer = (
    <Box sx={{ textAlign: 'center', paddingTop: '8px' }}>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
        <Box
          component={Link}
          href="/"
          onClick={handleDrawerToggle}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
              mr: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              NITS
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: '0.5px',
            }}
          >
            BAZAAR
          </Typography>
        </Box>
      </Box>
      <List sx={{ width: '100%' }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.href}
            onClick={handleDrawerToggle}
            sx={{
              py: 1.5,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: '1rem',
              }}
            />
          </ListItem>
        ))}
        <ListItem
          component={Link}
          href="/browse"
          onClick={handleDrawerToggle}
          sx={{
            py: 1.5,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <ListItemText
            primary="Search"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '1rem',
            }}
          />
        </ListItem>
        {user ? (
          <>
            <ListItem
              component={Link}
              href="/profile"
              onClick={handleDrawerToggle}
              sx={{
                py: 1.5,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <ListItemText
                primary="My Profile"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              />
            </ListItem>
            <ListItem
              component={Link}
              href="/my-listings"
              onClick={handleDrawerToggle}
              sx={{
                py: 1.5,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <ListItemText
                primary="My Listings"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                handleDrawerToggle();
                handleSignOut();
              }}
              sx={{
                py: 1.5,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '1rem',
                  color: 'error.main',
                }}
              />
            </ListItem>
          </>
        ) : (
          <ListItem
            component={Link}
            href="/auth/login"
            onClick={handleDrawerToggle}
            sx={{
              py: 1.5,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <ListItemText
              primary="Login"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: '1rem',
                color: 'primary.main',
              }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={0} sx={{
        backgroundColor: 'white',
        color: 'primary.main',
        // Make navbar sticky on mobile for better UX
        position: { xs: 'sticky', md: 'static' },
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}>
        <Toolbar sx={{
          px: { xs: 1, sm: 2, md: 3 },
          minHeight: { xs: '56px', sm: '64px' }
        }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                borderRadius: '8px',
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.3, sm: 0.5 },
                mr: { xs: 0.5, sm: 1 },
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <Typography
                variant={isSmallMobile ? 'subtitle1' : 'h6'}
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
                }}
              >
                NITS
              </Typography>
            </Box>
            <Typography
              variant={isSmallMobile ? 'subtitle1' : 'h6'}
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                letterSpacing: '0.5px',
                fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
              }}
            >
              BAZAAR
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  href={item.href}
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}

              <IconButton color="inherit" component={Link} href="/browse">
                <SearchIcon />
              </IconButton>

              {user ? (
                <>
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    component={Link}
                    href="/create-listing"
                    sx={{ mx: 2 }}
                  >
                    Add Listing
                  </Button>

                  <IconButton onClick={handleProfileMenuOpen}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {user.email?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                  >
                    <MenuItem component={Link} href="/profile">My Profile</MenuItem>
                    <MenuItem component={Link} href="/my-listings">My Listings</MenuItem>
                    <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  component={Link}
                  href="/auth/login"
                  startIcon={<PersonIcon />}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: { xs: '85%', sm: 320 },
            maxWidth: '100%',
            borderRadius: { xs: '0 16px 16px 0' },
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0,0,0,0.5)',
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
