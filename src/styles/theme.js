import { createTheme } from '@mui/material/styles';

export default createTheme({
  typography: {
    fontFamily: ['sans-serif', 'Red Hat Display'],
    body2: {
      fontFamily: ['monospace', 'Roboto Mono'],
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
