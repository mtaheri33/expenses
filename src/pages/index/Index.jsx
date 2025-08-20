// This is the component for the / page.

import Home from './components/home/Home';
import PageLoading from '../../components/page-loading/PageLoading';
import SignIn from './components/sign-in/SignIn';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../../utilities';

export default function Index() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);

  async function checkIsAuthenticated() {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      setIsAuthenticatedState(true);
    } else {
      setIsAuthenticatedState(false);
    }
  }
  useEffect(() => {
    checkIsAuthenticated();
  }, []);

  if (isAuthenticatedState === null) {
    return <PageLoading />;
  }
  if (isAuthenticatedState) {
    return <Home />;
  }
  return <SignIn setIsAuthenticatedState={setIsAuthenticatedState} />;
}
