import { createTheme } from '@mui/material/styles';

export default createTheme({
  typography: {
    fontFamily: "'Red Hat Display', sans-serif",
    body2: {
      fontFamily: "'Roboto Mono', monospace",
    },
  },
  palette: {
    common: {
      white: '#fafcff',
    },
    primary: {
      main: '#ffb3b9',
    },
    secondary: {
      main: '#fcf5c7',
    },
  },
});
