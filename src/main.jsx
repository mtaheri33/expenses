// This sets up the React app.

import './main.css';
import SignIn from './pages/index/SignIn';
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
    element: <SignIn />,
  },
]);

// This uses the DOM to get the root div element from index.html and
// then renders the React app within it.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
