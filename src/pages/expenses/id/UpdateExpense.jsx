// This is the component for the /expenses/:expenseId page.

import Navbar from '../../../components/navbar/Navbar';
import PageLoading from '../../../components/page-loading/PageLoading';
import PageMessage from '../../../components/page-message/PageMessage';
import UpdateExpenseForm from './components/UpdateExpenseForm';
import { PageMessageType } from '../../../../constants';
import InvalidPage from '../../invalid-page/InvalidPage';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { isAuthenticated, getRequest } from '../../../../utilities';

export default function UpdateExpense() {
  const navigate = useNavigate();
  const params = useParams();
  const expenseId = params.expenseId;
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [validExpense, setValidExpense] = useState(null);
  const [expense, setExpense] = useState({});
  const [pageMessageProperties, setPageMessageProperties] = useState({});

  function handleDefaultResponse() {
    setPageMessageProperties({
      type: PageMessageType.FAILURE,
      message: <span>Sorry, an error occurred. Please try again later.</span>,
      displayTime: 3000,
    });
  }

  function handleExpenses404Response() {
    setValidExpense(false);
  }

  async function handleExpenses200Response(response) {
    setValidExpense(true);
    const expense = await response.json();
    setExpense(expense);
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
    const expensesResponse = await getRequest(
      `/api/expenses/${expenseId}`,
      undefined,
      true,
    );
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
  if (validExpense === false) {
    return <InvalidPage />;
  }
  return (
    <div className='UpdateExpense'>
      <Navbar />
      <main>
        <PageMessage
          type={pageMessageProperties.type}
          message={pageMessageProperties.message}
          displayTime={pageMessageProperties.displayTime}
        />
        <UpdateExpenseForm />
      </main>
    </div>
  );
}
