// This sets up the React app.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './main.css';
import Index from './pages/index/Index';

// This creates a router for React to use to handle different pages of
// the website.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
]);

// This uses the DOM to get the root div element from index.html and
// then renders the React components within it.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
