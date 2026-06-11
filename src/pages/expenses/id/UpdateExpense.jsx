// This is the component for the /expenses/:expenseId page.

import ExpenseForm from '../../../components/expense-form/ExpenseForm';
import Navbar from '../../../components/navbar/Navbar';
import PageLoading from '../../../components/page-loading/PageLoading';
import { RequestMethod } from '../../../../constants';
import InvalidPage from '../../invalid-page/InvalidPage';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import styles from './UpdateExpense.module.css';
import { isAuthenticated, getRequest } from '../../../../utilities';

export default function UpdateExpense() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [validExpense, setValidExpense] = useState(null);
  const [expense, setExpense] = useState({});

  const navigate = useNavigate();
  const params = useParams();
  const expenseId = params.expenseId;

  async function handleExpenses200Response(response) {
    const expense = await response.json();
    setExpense({ ...expense, amount: String(expense.amount) });
    setValidExpense(true);
  }
  function handleExpenses404Response() {
    setValidExpense(false);
  }
  function handleDefaultResponse() {
    toast.error('Sorry, an error occurred. Please try again later.');
    setValidExpense(null);
  }
  async function handleExpensesResponse(response) {
    switch (response.status) {
      case 200:
        await handleExpenses200Response(response);
        break;
      case 404:
        handleExpenses404Response();
        break;
      default:
        handleDefaultResponse();
    }
  }
  async function getExpense() {
    const expensesResponse = await getRequest(`/api/expenses/${expenseId}`, undefined, true);
    await handleExpensesResponse(expensesResponse);
  }

  async function handleAuthenticated() {
    await getExpense();
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
  if (validExpense === null) {
    return (
      <div className='UpdateExpense'>
        <Navbar />
      </div>
    );
  }
  if (validExpense === false) {
    return <InvalidPage />;
  }
  return (
    <div className='UpdateExpense'>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.h1}>Edit Expense</h1>
        <ExpenseForm
          expenseData={expense}
          requestMethod={RequestMethod.PATCH}
          requestUrl={`/api/expenses/${expenseId}`}
        />
      </main>
    </div>
  );
}
