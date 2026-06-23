// This is the component for the /expenses page.

import ExpensesSearchForm from '../../components/expenses-search-form/ExpensesSearchForm';
import ExpensesTable from '../../components/expenses-table/ExpensesTable';
import Navbar from '../../components/navbar/Navbar';
import PageLoading from '../../components/page-loading/PageLoading';
import Spinner from '../../components/spinner/Spinner';
import { ExpenseSortProperty, SortOrder } from '../../../constants';
import styles from './Expenses.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'sonner';
import { isAuthenticated, getRequest, deleteRequest } from '../../../utilities';

export default function Expenses() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [tableSortProperty, setTableSortProperty] = useState(ExpenseSortProperty.DATE);
  const [tableSortOrder, setTableSortOrder] = useState(SortOrder.DESC);
  const [searchFormData, setSearchFormData] = useState({
    fromDate: '',
    toDate: '',
    description: '',
    fromAmount: '',
    toAmount: '',
    categoryType: '',
    categories: [],
  });
  const [expenses, setExpenses] = useState([]);
  const [hasMoreExpenses, setHasMoreExpenses] = useState(false);
  const [userCategories, setUserCategories] = useState([]);
  const [changingSort, setChangingSort] = useState(false);
  const [loadingMoreExpenses, setLoadingMoreExpenses] = useState(false);
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();
  const sentinelRef = useRef(null);
  // These are synchronous variables to prevent overlapping expense loads.
  const loadingMoreRef = useRef(false);
  const changingSortRef = useRef(false);
  const searchingRef = useRef(false);

  async function getExpenses(sortProperty, sortOrder, data, lastExpenseId = 'null') {
    let url = (
      `/api/expenses`
      + `?sortProperty=${sortProperty}`
      + `&sortOrder=${sortOrder}`
      + `&lastExpenseId=${lastExpenseId}`
      + `&fromDate=${encodeURIComponent(data.fromDate)}`
      + `&toDate=${encodeURIComponent(data.toDate)}`
      + `&description=${encodeURIComponent(data.description)}`
      + `&fromAmount=${encodeURIComponent(data.fromAmount)}`
      + `&toAmount=${encodeURIComponent(data.toAmount)}`
      + `&categoryType=${data.categoryType}`
    );
    if (data.categories.length === 0) {
      url += '&categories=';
    } else {
      for (let category of data.categories) {
        url += `&categories=${encodeURIComponent(category)}`;
      }
    }
    const expensesResponse = await getRequest(url, undefined, true);
    return expensesResponse;
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
  function handleDefaultResponse() {
    toast.error('Sorry, an error occurred. Please try again later.');
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

  async function getUserCategories() {
    const userCategoriesResponse = await getRequest('/api/expenses/categories', undefined, true);
    return userCategoriesResponse;
  }

  async function handleUserCategories200Response(response) {
    const userCategories = await response.json();
    setUserCategories(userCategories);
  }
  async function handleUserCategoriesResponse(response) {
    switch (response.status) {
      case 200:
        await handleUserCategories200Response(response);
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function handleAuthenticated() {
    const response = await getExpenses(tableSortProperty, tableSortOrder, searchFormData);
    await handleExpensesResponse(response, true);
    const userCategoriesResponse = await getUserCategories();
    await handleUserCategoriesResponse(userCategoriesResponse);
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

  function removeExpenseFromExpenses(expenseId) {
    setExpenses((currentExpenses) => {
      return currentExpenses.filter((expense) => expense.id !== expenseId);
    });
  }

  function handleExpenseDelete204Response(expenseId) {
    removeExpenseFromExpenses(expenseId);
    toast.success('Expense deleted successfully')
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
      const deleteResponse = await deleteRequest(`/api/expenses/${expenseId}`, undefined, true);
      handleExpenseDeleteResponse(deleteResponse, expenseId);
    }
  }

  async function sortExpenses(sortProperty, sortOrder) {
    changingSortRef.current = true;
    setChangingSort(true);
    setTableSortProperty(sortProperty);
    setTableSortOrder(sortOrder);
    const response = await getExpenses(sortProperty, sortOrder, searchFormData);
    await handleExpensesResponse(response, true);
    changingSortRef.current = false;
    setChangingSort(false);
  }

  async function getMoreExpenses() {
    if (
      expenses.length === 0
      || !hasMoreExpenses
      || loadingMoreRef.current
      || changingSortRef.current
      || searchingRef.current
    ) {
      return;
    }
    loadingMoreRef.current = true;
    setLoadingMoreExpenses(true);
    const lastExpense = expenses[expenses.length - 1];
    const lastExpenseId = lastExpense.id;
    const response = await getExpenses(
      tableSortProperty,
      tableSortOrder,
      searchFormData,
      lastExpenseId,
    );
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
    if (
      !hasMoreExpenses
      || loadingMoreExpenses
      || changingSortRef.current
      || searchingRef.current
      || !sentinel
      || !isAuthenticatedState
    ) {
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
    isAuthenticatedState,
    hasMoreExpenses,
    loadingMoreExpenses,
    expenses,
    tableSortProperty,
    tableSortOrder,
    changingSort,
    searching,
    searchFormData,
  ]);

  async function searchExpenses(searchFormData) {
    searchingRef.current = true;
    setSearching(true);
    setSearchFormData(searchFormData);
    const response = await getExpenses(tableSortProperty, tableSortOrder, searchFormData);
    await handleExpensesResponse(response, true);
    searchingRef.current = false;
    setSearching(false);
  }

  if (isAuthenticatedState === null) {
    return <PageLoading />;
  }
  return (
    <div className='Expenses'>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.addExpenseContainer}>
          <Link to='/expenses/create'>Add Expense</Link>
        </div>
        <ExpensesSearchForm
          searchExpensesFunction={searchExpenses}
          userCategories={userCategories}
          searching={searching}
          styleClass={styles.expensesSearchForm}
        />
        <ExpensesTable
          expenses={expenses}
          showButtons={true}
          deleteExpenseFunction={deleteExpense}
          sortExpensesFunction={sortExpenses}
          tableSortProperty={tableSortProperty}
          tableSortOrder={tableSortOrder}
          changingSort={changingSort}
        />
        {hasMoreExpenses ? <div ref={sentinelRef} className={styles.sentinelRefDiv}></div> : null}
        {loadingMoreExpenses ?
          <Spinner styleClass={styles.loadingMoreExpensesSpinner} displayBlock={true} />
          : null
        }
      </main>
    </div>
  );
}
