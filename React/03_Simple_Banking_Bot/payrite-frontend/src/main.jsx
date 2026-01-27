import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/authContext';
import { UploadProvider } from './context/uploadContext';
import { PaymentProvider } from './context/paymentContext';

// Global Styles
import './assets/styles/global.css';

// App
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UploadProvider>
          <PaymentProvider>
            <App />
          </PaymentProvider>
        </UploadProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
