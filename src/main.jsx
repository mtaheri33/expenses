// This sets up the React app.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './main.css';
import Index from './pages/index/Index';

// This creates the routing between resource paths and React
// components.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
]);

// This uses the DOM to get the root div element from index.html and
// then renders the React app within it.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
