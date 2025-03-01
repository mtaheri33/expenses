// This is the component for the / page when the user is not signed in.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SignIn.module.css';

export default function SignIn() {
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(null);

  function showForgotPasswordMessage() {
    setForgotPasswordMessage(
      <div>Please contact michael.taheri33@gmail.com with the email you signed up with.</div>
    );
  }

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
        <div className={styles.forgotPasswordDiv}>
          <span
            className={styles.forgotPasswordSpan}
            onClick={showForgotPasswordMessage}
          >Forgot password?</span>
        </div>
        {forgotPasswordMessage}
      </div>
      <Link to='/signup' className={styles.signUpLink}>Sign Up</Link>
    </div>
  );
}
