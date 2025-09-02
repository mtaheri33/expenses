// This is the component for the /expenses page.

import ExpensesTable from './components/ExpensesTable';
import Navbar from '../../components/navbar/Navbar';
import PageLoading from '../../components/page-loading/PageLoading';
import PageMessage from '../../components/page-message/PageMessage';
import { PageMessageType } from '../../../constants';
import styles from './Expenses.module.css';
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router';
import { isAuthenticated, getRequest } from '../../../utilities';

export default function Expenses() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [pageMessageProperties, setPageMessageProperties] = useState({});

  function handleDefaultResponse() {
    setPageMessageProperties({
      type: PageMessageType.FAILURE,
      message: <span>Sorry, an error occurred. Please try again later.</span>,
      displayTime: 3000,
    });
  }

  async function handleExpenses200Response(response) {
    const expenses = await response.json();
    setExpenses(expenses);
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

  async function getExpenses() {
    const expensesResponse = await getRequest(
      '/api/expenses',
      undefined,
      true,
    );
    await handleExpensesResponse(expensesResponse);
  }

  async function handleAuthenticated() {
    await getExpenses();
    setIsAuthenticatedState(true);
  }

  async function checkIsAuthenticated() {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      handleAuthenticated();
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
          <PageMessage
            type={pageMessageProperties.type}
            message={pageMessageProperties.message}
            displayTime={pageMessageProperties.displayTime}
          />
          <div className={styles.addExpenseContainer}>
            <Link to='/expenses/create'>Add Expense</Link>
          </div>
          <ExpensesTable expenses={expenses} />
        </main>
      </div>
    );
  }
  return <Navigate to='/' replace />;
}
