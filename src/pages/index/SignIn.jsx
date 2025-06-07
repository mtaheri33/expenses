// This is the component for the / page when the user is not signed in.

import ExpensesHeader from '../../components/expenses-header/ExpensesHeader';
import ForgotPasswordContainer from './components/ForgotPasswordContainer';
import SignInForm from './components/SignInForm';
import { Link } from 'react-router';
import styles from './SignIn.module.css';

export default function SignIn({ setIsSignedIn }) {
  /*
  setIsSignedIn required function(boolean)
  */

  return (
    <div className={'SignIn ' + styles.SignIn}>
      <ExpensesHeader styleClass={styles.expensesHeader} />
      <SignInForm setIsSignedIn={setIsSignedIn} />
      <ForgotPasswordContainer />
      <Link to='/signup' className={styles.signUpLink}>Sign Up</Link>
    </div>
  );
}
