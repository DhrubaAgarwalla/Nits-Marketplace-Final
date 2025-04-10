import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create base theme with NIT Silchar colors
let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue color representing NIT Silchar
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057', // Accent color for buttons and highlights
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          // Responsive padding for mobile
          '@media (max-width:600px)': {
            padding: '8px 16px',
            fontSize: '0.875rem',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          },
          // Disable hover effect on mobile for better performance
          '@media (max-width:600px)': {
            '&:hover': {
              transform: 'none',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          // Add padding for mobile screens
          '@media (max-width:600px)': {
            padding: '0 16px',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          // Reduce padding on mobile
          '@media (max-width:600px)': {
            paddingLeft: 8,
            paddingRight: 8,
            minHeight: 56,
          },
        },
      },
    },
  },
  // Custom breakpoints for better mobile responsiveness
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
