import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import './styles/swiss.css';
import './index.css';


const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#f4ebfe',
          100: '#e5cdfd',
          200: '#cfacef',
          300: '#b483e5',
          400: '#9b5ce0',
          500: '#791ae5',
          600: '#6415bf',
          700: '#52119d',
          800: '#400c7a',
          900: '#2b0653',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          50: '#f4ebfe',
          100: '#e5cdfd',
          200: '#cfacef',
          300: '#9549f0',
          400: '#8c33eb',
          500: '#a35cf5',
          600: '#791ae5',
          700: '#6415bf',
          800: '#52119d',
          900: '#400c7a',
        },
      },
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);
