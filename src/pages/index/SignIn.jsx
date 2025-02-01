// This is the component for the / page when the user is not signed in.

import styles from './SignIn.module.css';

export default function SignIn() {
  return (
    <div className={'SignIn ' + styles.SignIn}>
      <h1><div className={styles.expensesHeader}>Expenses</div></h1>
      <h2>Sign In</h2>
      <form>
        <input type='text' placeholder='Email' autoFocus />
        <input type='password' placeholder='Password' />
        <button className={styles.signInButton}>Sign In</button>
      </form>
      <div className={styles.forgotPasswordContainer}>
        <span className={styles.forgotPasswordMessage}>Forgot password?</span>
      </div>
      <a className={styles.signUpLink}>Sign Up</a>
    </div>
  );
}
