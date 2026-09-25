import { createTheme } from '@mui/material/styles'

/**
 * Light-only theme for SentimentLab.
 *
 * The approved UI design is a light, analytical, technical interface:
 * white surfaces on a very light blue-grey page, thin borders,
 * subtle shadows, restrained accent colours and generous whitespace.
 * There is intentionally no dark theme.
 */

// Shared values used by several components.
export const tokens = {
  pageBackground: '#f6f7fb',
  surfaceBorder: 'rgba(15, 23, 42, 0.08)',
  cardShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  accentPrimary: '#2563eb',
  accentPurple: '#7c3aed',
  accentGreen: '#16a34a',
  accentAmber: '#d97706',
  tintPrimary: '#eaf1ff',
  tintPurple: '#f1eaff',
  tintGreen: '#e7f7ee',
  tintAmber: '#fdf3e3',
  infoBackground: '#f2f6ff',
  infoBorder: '#dbe6ff',
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.accentPrimary, dark: '#1d4ed8', light: '#60a5fa', contrastText: '#ffffff' },
    secondary: { main: tokens.accentPurple },
    success: { main: tokens.accentGreen },
    warning: { main: tokens.accentAmber },
    error: { main: '#dc2626' },
    info: { main: tokens.accentPrimary },
    background: { default: tokens.pageBackground, paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b', disabled: '#94a3b8' },
    divider: tokens.surfaceBorder,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      "'Inter', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
    h1: { fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h2: { fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' },
    body1: { fontSize: '0.9375rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem' },
    button: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.pageBackground },
        '#root': { minHeight: '100vh' },
      },
    },
    // MUI injects an elevation overlay on Paper/Card; the design uses flat surfaces.
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.surfaceBorder}`,
          borderRadius: 12,
          boxShadow: tokens.cardShadow,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8, paddingInline: 18, minHeight: 40 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#ffffff',
          fontSize: '0.9375rem',
          '& fieldset': { borderColor: tokens.surfaceBorder },
          '&:hover fieldset': { borderColor: 'rgba(15, 23, 42, 0.18)' },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 8, borderRadius: 999, backgroundColor: '#eef1f6' },
        bar: { borderRadius: 999 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.75rem', borderRadius: 6, padding: '6px 10px' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontSize: '0.875rem', alignItems: 'center' },
      },
    },
  },
})

export default theme
