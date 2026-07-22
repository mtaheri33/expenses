// This is the component for the /sign-up page.

import ExpensesHeader from '../../components/expenses-header/ExpensesHeader';
import Spinner from '../../components/spinner/Spinner';
import { useState } from 'react';
import { Link } from 'react-router';
import styles from './SignUp.module.css';
import {
  createHandleInputChangeFunction,
  createAddSubmitMessageFunction,
  postRequest,
} from '../../../utilities';

export default function SignUp() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessages, setSubmitMessages] = useState([]);

  const handleInputChange = createHandleInputChangeFunction(setFormData);
  const addSubmitMessage = createAddSubmitMessageFunction(setSubmitMessages);

  function validInputs() {
    if (formData.email === '' || formData.password === '') {
      addSubmitMessage('Please fill out all fields');
      return false;
    }
    return true;
  }

  function handle201Response() {
    addSubmitMessage(<>Success. Please log in <Link to='/'>here</Link>.</>);
  }
  function handle409Response() {
    addSubmitMessage('This email is already being used');
  }
  function handleDefaultResponse() {
    addSubmitMessage('Sorry, an error occurred. Please try again later.');
  }
  function handlePostResponse(response) {
    switch (response.status) {
      case 201:
        handle201Response();
        break;
      case 409:
        handle409Response();
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function signUp(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessages([]);
    if (validInputs(formData)) {
      const postResponse = await postRequest(
        '/api/sign-up',
        JSON.stringify(formData),
        { 'Content-Type': 'application/json' },
      );
      handlePostResponse(postResponse);
    }
    setIsSubmitting(false);
  }

  return (
    <div className={`SignUp ${styles.SignUp}`}>
      <ExpensesHeader styleClass={styles.expensesHeader} />
      <h2 className={styles.h2}>Sign Up</h2>
      <form onSubmit={signUp}>
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
          autoComplete='new-password'
        />
        <button className={styles.signUpButton}>
          {isSubmitting ? <Spinner styleClass={styles.signUpSpinner} /> : 'Sign Up'}
        </button>
        {submitMessages.map((message) => {
          return <div key={message} className={styles.submitMessage}>{message}</div>;
        })}
      </form>
    </div>
  );
}
