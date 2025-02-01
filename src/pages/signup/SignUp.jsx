// This is the component for the /signup page.

import { useState } from 'react';
import styles from './SignUp.module.css';

export default function SignUp() {
  const [submitMessage, setSubmitMessage] = useState('');

  async function postData(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200) {
      return false;
    }
    return true;
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
    const data = getFormData(event.target);
    if (!validInputs(data)) {
      setSubmitMessage('Please fill out all fields.');
      return;
    }
    const userCreated = await postData(
      import.meta.env.VITE_SERVER_ADDRESS + '/signup',
      data,
    );
    if (userCreated) {
      setSubmitMessage('Success.');
      return;
    }
    setSubmitMessage('Sorry, an error occurred.  Please try again later.');
    return;
  }

  return (
    <div className={'SignUp ' + styles.SignUp}>
      <h1><div className={styles.expensesHeader}>Expenses</div></h1>
      <h2>Sign Up</h2>
      <form onSubmit={signUp}>
        <input type='text' name='email' placeholder='Email' autoFocus />
        <input type='password' name='password' placeholder='Password' />
        <button className={styles.signUpButton}>Sign Up</button>
      </form>
      <div className={styles.submitMessage}>{submitMessage}</div>
    </div>
  );
}
