// This is the component for the / page.

import ExpensesHeader from '../../components/expenses-header/ExpensesHeader';
import ForgotPasswordContainer from './components/ForgotPasswordContainer';
import SignInForm from './components/SignInForm';
import styles from './Index.module.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { isAuthenticated } from '../../utilities';

export default function Index() {
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
    return (<div>Loading...</div>);
  }
  if (isAuthenticatedState === true) {
    return (<div>Home Page</div>);
  }
  return (
    <div className={'Index ' + styles.Index}>
      <ExpensesHeader styleClass={styles.expensesHeader} />
      <SignInForm setIsAuthenticatedState={setIsAuthenticatedState} />
      <ForgotPasswordContainer />
      <Link to='/signup' className={styles.signUpLink}>Sign Up</Link>
    </div>
  );
}
