import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { ThemeProvider, useTheme } from './theme/ThemeContext.jsx'
import { ErrorProvider } from './contexts/ErrorContext'
import './index.css'
import './i18n/i18n'
import App from './App.jsx'

const ThemedApp = () => {
  const { theme } = useTheme();
  return (
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ErrorProvider>
        <ThemedApp />
      </ErrorProvider>
    </ThemeProvider>
  </StrictMode>,
)
