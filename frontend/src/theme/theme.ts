import { createTheme, ThemeOptions } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    bg: Palette['primary'];
    section: Palette['primary'];
  }
  interface PaletteOptions {
    bg: PaletteOptions['primary'];
    section: PaletteOptions['primary'];
  }
}

const themeOptions: ThemeOptions = {
  spacing: 8,
  palette: {
    type: 'light',
    primary: {
      dark: '#000',
      main: '#111832',
      light: '#fbf3ed',
    },
    secondary: {
      dark: '#f0dfd7',
      main: '#fbf3ed',
      light: '#f1f5f8',
    },
    text: {
      primary: '#111832',
      secondary: '#fbf3ed', // "inverse", to be used on dark backgrounds
    },
    background: {
      default: '#ffffff',
      paper: '#f1f5f8',
    },
    bg: {
      main: '#fff',
      light: '#f1f5f8',
      dark: '#111832',
    },
    section: {
      main: '#fbf3ed',
      dark: '#f0dfd7',
    },
    divider: '#111832',
    error: {
      main: '#fad7d9',
      dark: '#DE0000', // Use for error text
    },
    warning: {
      main: '#f9e180',
    },
    info: {
      main: '#dfebd9',
    },
    success: {
      main: '#dfebd9',
    },
  },
  typography: {
    fontFamily: '"Lexend",sans-serif',
    body1: {
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: '1.75rem',
      letterSpacing: '.018em',
    },
    body2: {
      fontSize: '1rem',
      letterSpacing: '.018em',
      fontWeight: 300,
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.125rem',
      fontStyle: 'normal',
      letterSpacing: 0,
      lineHeight: 1.5,
      /* '@media (min-width: 45rem)': {
        fontSize: '2.375rem',
      }, */
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.625rem',
      fontStyle: 'normal',
      lineHeight: 1.25,
      letterSpacing: 0,
      '@media (min-width: 45rem)': {
        fontSize: '1.875rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.1875rem',
      fontStyle: 'normal',
      lineHeight: 1.25,
      letterSpacing: 0,
      '@media (min-width: 45rem)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.125rem',
      fontStyle: 'normal',
      lineHeight: 1.5,
      letterSpacing: 0,
      '@media (min-width: 45rem)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.125rem',
      fontStyle: 'normal',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.125rem',
      fontStyle: 'normal',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      lineHeight: '1.75rem',
      letterSpacing: '.018em',
    },
    subtitle2: {
      fontSize: 20,
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
    caption: {
      fontSize: '1rem',
      fontWeight: 300,
      borderBottomWidth: '0.25rem',
      borderBottomStyle: 'solid',
      borderBottomColor: '#000',
      letterSpacing: '0.018em',
    },
    overline: {
      fontWeight: 500,
      lineHeight: 1.25,
    },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '0.9rem',
        color: '#ffffff',
        backgroundColor: '#111832',
        opacity: 1,
      },
      arrow: {
        color: '#111832',
      },
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true, // Globally disable ripple effect on buttons
    },
  },
};

export const theme = createTheme(themeOptions);
