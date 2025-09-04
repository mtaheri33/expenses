// This is the component for the /expenses/create page.

import CreateExpenseForm from './components/CreateExpenseForm';
import Navbar from '../../../components/navbar/Navbar';
import PageLoading from '../../../components/page-loading/PageLoading';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isAuthenticated } from '../../../../utilities';

export default function CreateExpense() {
  const navigate = useNavigate();
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);

  async function checkIsAuthenticated() {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      setIsAuthenticatedState(true);
    } else {
      navigate('/');
    }
  }
  useEffect(() => {
    checkIsAuthenticated();
  }, []);

  if (isAuthenticatedState === null) {
    return <PageLoading />;
  }
  return (
    <div className='CreateExpense'>
      <Navbar />
      <main>
        <CreateExpenseForm />
      </main>
    </div>
  );
}
