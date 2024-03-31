import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import { ButtonsProvider } from './contexts/ButtonsContext';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ButtonsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ButtonsProvider>
  </React.StrictMode>
);
