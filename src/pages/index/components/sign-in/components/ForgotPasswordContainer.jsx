// This is a forgot password component for the sign in page.

import styles from './ForgotPasswordContainer.module.css';
import { useState } from 'react';

export default function ForgotPasswordContainer() {
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  function showForgotPasswordMessage() {
    setForgotPasswordMessage(
      'Please contact michael.taheri33@gmail.com with the email you signed up with.'
    );
  }

  return (
    <div className={'ForgotPasswordContainer ' + styles.ForgotPasswordContainer}>
      <span className={styles.forgotPasswordSpan} onClick={showForgotPasswordMessage}>
        Forgot password?
      </span>
      {forgotPasswordMessage !== '' ?
        <div className={styles.forgotPasswordMessage}>{forgotPasswordMessage}</div>
        : null
      }
    </div>
  );
}
