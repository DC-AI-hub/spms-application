import React, { createContext, useState, useContext, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = useCallback((message, severity = 'error') => {
    const id = Date.now();
    setErrors(prev => [...prev, { id, message, severity }]);
    
    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setErrors(prev => prev.filter(error => error.id !== id));
    }, 6000);
  }, []);

  const removeError = useCallback((id) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={{ addError, removeError }}>
      {children}
      {errors.map((error) => (
        <Snackbar
          key={error.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => removeError(error.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => removeError(error.id)} 
            severity={error.severity}
            sx={{ width: '100%' }}
          >
            {error.message}
          </Alert>
        </Snackbar>
      ))}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
