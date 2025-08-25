// This is the component for the /expenses page.

import Navbar from '../../components/navbar/Navbar';
import PageLoading from '../../components/page-loading/PageLoading';
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router';
import { isAuthenticated } from '../../../utilities';

export default function Expenses() {
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
    return (
      <div className='Expenses'>
        <Navbar />
        <main>
          expenses
          <br />
          <Link to='/expenses/create'>add expense</Link>
        </main>
      </div>
    );
  }
  return <Navigate to='/' replace />;
}
