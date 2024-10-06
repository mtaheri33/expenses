// This sets up the React app.

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './main.css';
import CssBaseline from '@mui/material/CssBaseline';
import Index from './pages/index/Index';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// This creates the routing between resource paths and React
// components.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
]);

// This uses the DOM to get the root div element from index.html and
// then renders the React app within it.  CssBaseline removes default
// browser styles.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </StrictMode>,
);
