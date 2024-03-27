import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './components/AppRouter';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthenticationContextProvider from './components/authentication/authenticationContextProvider';
import './index.css';
import { RouterProvider } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1067310328771-don2j7q8le595rbv260bjg3mg5dga2h9.apps.googleusercontent.com">
    <React.StrictMode>
      <AuthenticationContextProvider>
        <RouterProvider router={AppRouter} />
      </AuthenticationContextProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
