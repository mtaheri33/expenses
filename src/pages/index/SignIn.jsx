// This is the component for the / page when the user is not signed in.

import Spinner from '../../components/spinner/Spinner';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SignIn.module.css';

export default function SignIn() {
  const signInButton = <button className={styles.signInButton}>Sign In</button>;
  const spinner = <Spinner styleClass={styles.signInSpinner} />;
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(null);
  const [bottomOfSignInForm, setBottomOfSignInForm] = useState(signInButton);
  const [submitMessage, setSubmitMessage] = useState(null);

  function handlePostResponse(response) {
    switch (response.status) {
      case 200:
        console.log('login success');
        break;
      case 400:
        setSubmitMessage('The email or password is incorrect.');
        break;
      default:
        setSubmitMessage('Sorry, an error occurred. Please try again later.');
    }
    return;
  }

  async function postData(url, data) {
    try {
      return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {
      return { status: 503 };
    }
  }

  function validInputs(inputs) {
    for (let name in inputs) {
      if (inputs[name].length === 0) {
        return false;
      }
    }
    return true;
  }

  function getFormData(form) {
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());
    return formDataObject;
  }

  async function signIn(event) {
    event.preventDefault();
    setBottomOfSignInForm(spinner);
    setSubmitMessage(null);
    const data = getFormData(event.target);
    if (!validInputs(data)) {
      setSubmitMessage('Please fill out all fields.');
    } else {
      const postResponse = await postData(
        import.meta.env.VITE_SERVER_ADDRESS + '/signin',
        data,
      );
      handlePostResponse(postResponse);
    }
    setBottomOfSignInForm(signInButton);
    return;
  }

  function showForgotPasswordMessage() {
    setForgotPasswordMessage(
      <div>Please contact michael.taheri33@gmail.com with the email you signed up with.</div>
    );
  }

  return (
    <div className={'SignIn ' + styles.SignIn}>
      <h1><div className={styles.expensesHeader}>Expenses</div></h1>
      <h2>Sign In</h2>
      <form onSubmit={signIn}>
        <input type='text' name='email' placeholder='Email' autoFocus />
        <input type='password' name='password' placeholder='Password' />
        {bottomOfSignInForm}
      </form>
      <div className={styles.submitMessage}>{submitMessage}</div>
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
