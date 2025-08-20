// This is the component for the /sign-up page.

import ExpensesHeader from '../../components/expenses-header/ExpensesHeader';
import SignUpForm from './components/SignUpForm';
import styles from './SignUp.module.css';

export default function SignUp() {
  return (
    <div className={`SignUp ${styles.SignUp}`}>
      <ExpensesHeader styleClass={styles.expensesHeader} />
      <SignUpForm />
    </div>
  );
}
