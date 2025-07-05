// This is a component for a sign in page.

import ExpensesHeader from '../../../../components/expenses-header/ExpensesHeader';
import ForgotPasswordContainer from './components/ForgotPasswordContainer';
import SignInForm from './components/SignInForm';
import { Link } from 'react-router';
import styles from './SignIn.module.css';

export default function SignIn({ setIsAuthenticatedState }) {
  /*
  setIsAuthenticatedState required function(boolean)
  */

  return (
    <div className={'SignIn ' + styles.SignIn}>
      <ExpensesHeader styleClass={styles.expensesHeader} />
      <SignInForm setIsAuthenticatedState={setIsAuthenticatedState} />
      <ForgotPasswordContainer />
      <Link to='/signup' className={styles.signUpLink}>Sign Up</Link>
    </div>
  );
}
