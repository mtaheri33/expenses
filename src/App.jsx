// This is the top level React component.

import Index from './pages/index/Index';
import InvalidPage from './pages/invalid-page/InvalidPage';
import SignUp from './pages/signup/SignUp';
import { Routes, Route } from 'react-router';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/*' element={<InvalidPage />} />
    </Routes>
  );
}
