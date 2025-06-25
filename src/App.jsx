// This is the top level React component.

import Home from './pages/index/Home';
import SignIn from './pages/index/SignIn';
import InvalidPage from './pages/invalid-page/InvalidPage';
import SignUp from './pages/signup/SignUp';
import { useState } from 'react';
import { Routes, Route } from 'react-router';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <Routes>
      <Route path='/' element={isSignedIn ? <Home /> : <SignIn setIsSignedIn={setIsSignedIn} />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path="/*" element={<InvalidPage />} />
    </Routes>
  );
}
