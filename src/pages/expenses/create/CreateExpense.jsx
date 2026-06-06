// This is the component for the /expenses/create page.

import ExpenseForm from '../../../components/expense-form/ExpenseForm';
import Navbar from '../../../components/navbar/Navbar';
import PageLoading from '../../../components/page-loading/PageLoading';
import { RequestMethod } from '../../../../constants';
import styles from './CreateExpense.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isAuthenticated } from '../../../../utilities';

export default function CreateExpense() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);

  const navigate = useNavigate();
  const expenseData = {
    date: '',
    description: '',
    amount: '',
    categories: [''],
  };

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
      <main className={styles.main}>
        <h1 className={styles.h1}>Create Expense</h1>
        <ExpenseForm
          expenseData={expenseData}
          requestMethod={RequestMethod.POST}
          requestUrl='/api/expenses'
        />
      </main>
    </div>
  );
}
