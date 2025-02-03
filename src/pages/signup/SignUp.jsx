// This is the component for the /signup page.

import Spinner from '../../components/spinner/Spinner';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SignUp.module.css';

export default function SignUp() {
  const signUpButton = <button className={styles.signUpButton}>Sign Up</button>;
  const spinner = <Spinner styleClass={styles.signUpSpinner} />;
  const [bottomOfSignUpForm, setBottomOfSignUpForm] = useState(signUpButton);
  const [submitMessage, setSubmitMessage] = useState('');

  function handlePostResponse(response) {
    switch (response.status) {
      case 200:
        setSubmitMessage(
          <span>Success. Please log in <Link to='/'>here</Link>.</span>
        );
        break;
      case 400:
        setSubmitMessage('This email is already being used.');
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

  async function signUp(event) {
    event.preventDefault();
    setBottomOfSignUpForm(spinner);
    setSubmitMessage('');
    const data = getFormData(event.target);
    if (!validInputs(data)) {
      setSubmitMessage('Please fill out all fields.');
    } else {
      const postResponse = await postData(
        import.meta.env.VITE_SERVER_ADDRESS + '/signup',
        data,
      );
      handlePostResponse(postResponse);
    }
    setBottomOfSignUpForm(signUpButton);
    return;
  }

  return (
    <div className={'SignUp ' + styles.SignUp}>
      <h1><div className={styles.expensesHeader}>Expenses</div></h1>
      <h2>Sign Up</h2>
      <form onSubmit={signUp}>
        <input type='text' name='email' placeholder='Email' autoFocus />
        <input type='password' name='password' placeholder='Password' />
        {bottomOfSignUpForm}
      </form>
      <div className={styles.submitMessage}>{submitMessage}</div>
    </div>
  );
}
