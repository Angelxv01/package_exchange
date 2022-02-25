import { createTheme } from '@mui/material/styles';

export default createTheme({
  typography: {
    fontFamily: "'Red Hat Display', sans-serif",
    body2: {
      fontFamily: "'Roboto Mono', monospace",
    },
  },
  palette: {
    primary: {
      main: '#ffb3b9',
    },
    secondary: {
      main: '#fcf5c7',
    },
    background: {
      default: '#fafcff',
    },
    custom: {
      gray: '#efeff6',
    },
  },
});
