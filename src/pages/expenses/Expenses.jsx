// This is the component for the /expenses page.

import ExpensesTable from '../../components/expenses-table/ExpensesTable';
import Navbar from '../../components/navbar/Navbar';
import PageLoading from '../../components/page-loading/PageLoading';
import PageMessage from '../../components/page-message/PageMessage';
import Spinner from '../../components/spinner/Spinner';
import { PageMessageType, ExpenseSortProperty, SortOrder } from '../../../constants';
import styles from './Expenses.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { isAuthenticated, getRequest, deleteRequest } from '../../../utilities';

export default function Expenses() {
  const navigate = useNavigate();
  const sentinelRef = useRef(null);
  // This is a synchronous variable to prevent overlapping more expense loads.
  const loadingMoreRef = useRef(false);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [pageMessageProperties, setPageMessageProperties] = useState({});
  const [tableSortProperty, setTableSortProperty] = useState(ExpenseSortProperty.DATE);
  const [tableSortOrder, setTableSortOrder] = useState(SortOrder.DESC);
  const [hasMoreExpenses, setHasMoreExpenses] = useState(null);
  const [loadingMoreExpenses, setLoadingMoreExpenses] = useState(false);

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

  async function handleExpenses200Response(response, overwriteExpenses) {
    const results = await response.json();
    if (overwriteExpenses) {
      setExpenses(results.pageExpenses);
    } else {
      setExpenses((currentExpenses) => currentExpenses.concat(results.pageExpenses));
    }
    setHasMoreExpenses(results.hasMore);
  }

  async function handleExpensesResponse(response, overwriteExpenses) {
    switch (response.status) {
      case 200:
        await handleExpenses200Response(response, overwriteExpenses);
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function getExpenses(sortProperty, sortOrder, lastExpenseId = 'null') {
    const url = (
      `/api/expenses?sortProperty=${sortProperty}&sortOrder=${sortOrder}`
      + `&lastExpenseId=${lastExpenseId}`
    );
    const expensesResponse = await getRequest(
      url,
      undefined,
      true,
    );
    return expensesResponse;
  }

  async function handleAuthenticated() {
    const response = await getExpenses(tableSortProperty, tableSortOrder);
    await handleExpensesResponse(response, true);
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

  async function sortExpenses(sortProperty, sortOrder) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const response = await getExpenses(sortProperty, sortOrder);
    await handleExpensesResponse(response, true);
    setTableSortProperty(sortProperty);
    setTableSortOrder(sortOrder);
  }

  async function getMoreExpenses() {
    if (expenses.length === 0 || !hasMoreExpenses || loadingMoreRef.current) {
      return;
    }
    const lastExpense = expenses[expenses.length - 1];
    const lastExpenseId = lastExpense.id;
    loadingMoreRef.current = true;
    setLoadingMoreExpenses(true);
    const response = await getExpenses(tableSortProperty, tableSortOrder, lastExpenseId);
    await handleExpensesResponse(response, false);
    loadingMoreRef.current = false;
    setLoadingMoreExpenses(false);
  }

  // After the page loads and the user's first page of expenses are set, if they have more expenses
  // then the observer is created and starts observing the sentinel, which is the div below the
  // expenses table.  When the user scrolls a bit before the bottom where the sentinel div is, the
  // IntersectionObserver callback runs and gets the next page of expenses.  Whenever one of the
  // useEffect dependencies changes, the cleanup function runs to stop observing and disconnect the
  // observer.  It then runs useEffect again, and if the user still has more expenses it creates
  // and starts a new observer.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMoreExpenses || loadingMoreExpenses || !sentinel) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          getMoreExpenses();
        }
      },
      {
        root: null,
        // Do not use vw, px must be used.
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1,
      },
    );
    observer.observe(sentinel);
    return () => {
      observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [
    hasMoreExpenses,
    loadingMoreExpenses,
    expenses.length,
    tableSortProperty,
    tableSortOrder,
  ]);

  if (isAuthenticatedState === null) {
    return <PageLoading />;
  }
  return (
    <div className='Expenses'>
      <Navbar />
      <main className={styles.main}>
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
          showButtons={true}
          deleteExpenseFunction={deleteExpense}
          sortExpensesFunction={sortExpenses}
          tableSortProperty={tableSortProperty}
          tableSortOrder={tableSortOrder}
        />
        {hasMoreExpenses ? <div ref={sentinelRef} className={styles.sentinelRefDiv}></div> : null}
        {loadingMoreExpenses ? <Spinner styleClass={styles.loadingMoreExpensesSpinner} /> : null}
      </main>
    </div>
  );
}
