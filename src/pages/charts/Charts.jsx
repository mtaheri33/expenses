// This is the component for the /charts page.

import styles from './Charts.module.css';
import CategoryTotalBarChart from '../../components/charts/bar/CategoryTotalBarChart';
import MonthlyTotalBarChart from '../../components/charts/bar/MonthlyTotalBarChart';
import Navbar from '../../components/navbar/Navbar';
import PageLoading from '../../components/page-loading/PageLoading';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { isAuthenticated, getRequest } from '../../../utilities';

export default function Charts() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const navigate = useNavigate();

  async function getExpenses() {
    const response = await getRequest('/api/charts', undefined, true);
    return response;
  }

  async function handleExpenses200Response(response) {
    const results = await response.json();
    setExpenses(results);
  }
  function handleDefaultResponse() {
    toast.error('Sorry, an error occurred. Please try again later.');
  }
  async function handleExpensesResponse(response) {
    switch (response.status) {
      case 200:
        await handleExpenses200Response(response);
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function handleAuthenticated() {
    const expensesResponse = await getExpenses();
    await handleExpensesResponse(expensesResponse);
    setIsAuthenticatedState(true);
  }
  async function checkIsAuthenticated() {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      handleAuthenticated();
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
    <div className='Charts'>
      <Navbar />
      <main className={styles.main}>
        <MonthlyTotalBarChart expenses={expenses} />
        <CategoryTotalBarChart expenses={expenses} />
      </main>
    </div>
  );
}
