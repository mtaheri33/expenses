// This is the component for the / page when the user is signed out.

import ExpensesHeader from '../../../components/expenses-header/ExpensesHeader';
import Spinner from '../../../components/spinner/Spinner';
import { useState } from 'react';
import { Link } from 'react-router';
import styles from './SignIn.module.css';
import {
  createHandleInputChangeFunction,
  createAddSubmitMessageFunction,
  postRequest,
} from '../../../../utilities';

export default function SignIn({ setIsAuthenticatedState }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessages, setSubmitMessages] = useState([]);
  const [showForgotPasswordMessage, setShowForgotPasswordMessage] = useState(false);

  const handleInputChange = createHandleInputChangeFunction(setFormData);
  const addSubmitMessage = createAddSubmitMessageFunction(setSubmitMessages);

  function validInputs() {
    if (formData.email === '' || formData.password === '') {
      addSubmitMessage('Please fill out all fields');
      return false;
    }
    return true;
  }

  function handle200Response() {
    setIsAuthenticatedState(true);
  }
  function handle401Response() {
    addSubmitMessage('The email or password is incorrect');
  }
  function handleDefaultResponse() {
    addSubmitMessage('Sorry, an error occurred. Please try again later.');
  }
  function handlePostResponse(response) {
    switch (response.status) {
      case 200:
        handle200Response();
        break;
      case 401:
        handle401Response();
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function signIn(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessages([]);
    if (validInputs()) {
      const postResponse = await postRequest(
        '/api/sign-in',
        JSON.stringify(formData),
        { 'Content-Type': 'application/json' },
        true,
      );
      handlePostResponse(postResponse);
    }
    setIsSubmitting(false);
  }

  return (
    <div className={`SignIn ${styles.SignIn}`}>
      <ExpensesHeader styleClass={styles.expensesHeader} />
      <h2 className={styles.h2}>Sign In</h2>
      <form className={styles.form} onSubmit={signIn}>
        <input
          type='email'
          className={styles.formInput}
          value={formData.email}
          onChange={handleInputChange}
          name='email'
          placeholder='Email'
          autoComplete='email'
          autoFocus
        />
        <input
          type='password'
          className={styles.formInput}
          value={formData.password}
          onChange={handleInputChange}
          name='password'
          placeholder='Password'
          autoComplete='current-password'
        />
        <button className={styles.signInButton}>
          {isSubmitting ? <Spinner styleClass={styles.signInSpinner} /> : 'Sign In'}
        </button>
        {submitMessages.map((message) => {
          return <div key={message} className={styles.submitMessage}>{message}</div>;
        })}
      </form>
      <div className={styles.forgotPasswordContainer}>
        <span className='clickableSpan' onClick={() => setShowForgotPasswordMessage(true)}>
          Forgot password?
        </span>
        {showForgotPasswordMessage ?
          <div className={styles.forgotPasswordMessage}>
            Please contact michael.taheri33@gmail.com with the email you signed up with
          </div>
          : null
        }
      </div>
      <Link to='/sign-up' className={styles.signUpLink}>Sign Up</Link>
    </div>
  );
}
