// This is the component for the /expenses page.

import ExpensesTable from './components/ExpensesTable';
import Navbar from '../../components/navbar/Navbar';
import PageLoading from '../../components/page-loading/PageLoading';
import PageMessage from '../../components/page-message/PageMessage';
import { PageMessageType } from '../../../constants';
import styles from './Expenses.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  isAuthenticated,
  getRequest,
  deleteRequest,
  sortExpensesByDate,
  sortExpensesByDescription,
  sortExpensesByAmount,
} from '../../../utilities';

export default function Expenses() {
  const navigate = useNavigate();
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [pageMessageProperties, setPageMessageProperties] = useState({});

  function sortExpenses(key, sortOrder) {
    setExpenses((currentExpenses) => {
      const currentExpensesCopy = [...currentExpenses];
      if (key === 'date') {
        sortExpensesByDate(currentExpensesCopy, sortOrder);
      } else if (key === 'description') {
        sortExpensesByDescription(currentExpensesCopy, sortOrder);
      } else if (key === 'amount') {
        sortExpensesByAmount(currentExpensesCopy, sortOrder);
      }
      return currentExpensesCopy;
    });
  }

  function handleDefaultResponse() {
    setPageMessageProperties({
      type: PageMessageType.FAILURE,
      message: <span>Sorry, an error occurred. Please try again later.</span>,
      displayTime: 3000,
    });
  }

  function removeExpenseFromExpenses(expenseId) {
    setExpenses((currentExpenses) => {
      return currentExpenses.filter((expense) => expense.id !== expenseId);
    });
  }

  function handleExpenseDelete204Response(expenseId) {
    removeExpenseFromExpenses(expenseId);
    setPageMessageProperties({
      type: PageMessageType.SUCCESS,
      message: <span>Expense deleted successfully.</span>,
      displayTime: 3000,
    });
  }

  function handleExpenseDeleteResponse(response, expenseId) {
    switch (response.status) {
      case 204:
        handleExpenseDelete204Response(expenseId);
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function deleteExpense(expenseId) {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const deleteResponse = await deleteRequest(
        `/api/expenses/${expenseId}`,
        undefined,
        true,
      );
      handleExpenseDeleteResponse(deleteResponse, expenseId);
    }
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
    <div className='Expenses'>
      <Navbar />
      <main>
        <PageMessage
          type={pageMessageProperties.type}
          message={pageMessageProperties.message}
          displayTime={pageMessageProperties.displayTime}
        />
        <div className={styles.addExpenseContainer}>
          <Link to='/expenses/create' className={styles.addExpenseLink}>Add Expense</Link>
        </div>
        <ExpensesTable
          expenses={expenses}
          deleteExpenseFunction={deleteExpense}
          sortExpensesFunction={sortExpenses}
        />
      </main>
    </div>
  );
}
