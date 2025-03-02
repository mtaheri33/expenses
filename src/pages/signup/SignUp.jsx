// This is the component for the /signup page.

import Spinner from '../../components/spinner/Spinner';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SignUp.module.css';

export default function SignUp() {
  const signUpButton = <button className={styles.signUpButton}>Sign Up</button>;
  const spinner = <Spinner styleClass={styles.signUpSpinner} />;
  const [formData, setFormData] = useState({ email: '', password: '' });
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

  async function signUp(event) {
    event.preventDefault();
    setBottomOfSignUpForm(spinner);
    setSubmitMessage('');
    if (!validInputs(formData)) {
      setSubmitMessage('Please fill out all fields.');
    } else {
      const postResponse = await postData(
        import.meta.env.VITE_SERVER_ADDRESS + '/signup',
        formData,
      );
      handlePostResponse(postResponse);
    }
    setBottomOfSignUpForm(signUpButton);
    return;
  }

  function handleInputChange(event) {
    setFormData((currentFormData) => {
      const currentFormDataCopy = { ...currentFormData };
      currentFormDataCopy[event.target.name] = event.target.value;
      return currentFormDataCopy;
    });
  }

  return (
    <div className={'SignUp ' + styles.SignUp}>
      <h1><div className={styles.expensesHeader}>Expenses</div></h1>
      <h2>Sign Up</h2>
      <form onSubmit={signUp}>
        <input type='text' value={formData.email} onChange={handleInputChange}
          name='email' placeholder='Email' autoFocus />
        <input type='password' value={formData.password} onChange={handleInputChange}
          name='password' placeholder='Password' />
        {bottomOfSignUpForm}
      </form>
      <div className={styles.submitMessage}>{submitMessage}</div>
    </div>
  );
}
