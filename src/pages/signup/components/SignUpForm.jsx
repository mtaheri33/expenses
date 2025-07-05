// This is a form component of the /signup page.

import Spinner from '../../../components/spinner/Spinner';
import { useState } from 'react';
import { Link } from 'react-router';
import styles from './SignUpForm.module.css';
import { createHandleInputChangeFunction, postRequest } from '../../../utilities';

export default function SignUpForm() {
  const signUpButton = <button className={styles.signUpButton}>Sign Up</button>;
  const spinner = <Spinner styleClass={styles.spinner} />;
  const [formData, setFormData] = useState({ email: '', password: '' });
  const handleInputChange = createHandleInputChangeFunction(setFormData);
  const [bottomOfForm, setBottomOfForm] = useState(signUpButton);
  const [submitMessage, setSubmitMessage] = useState('');

  function handleDefaultResponse() {
    setSubmitMessage('Sorry, an error occurred. Please try again later.');
  }

  function handle409Response() {
    setSubmitMessage('This email is already being used.');
  }

  function handle201Response() {
    setSubmitMessage(['Success. Please log in ', <Link key='indexLink' to='/'>here</Link>, '.']);
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
    setBottomOfForm(spinner);
    setSubmitMessage('');
    if (!validInputs(formData)) {
      setSubmitMessage('Please fill out all fields.');
    } else {
      const postResponse = await postRequest(
        '/api/signup',
        JSON.stringify(formData),
        { 'Content-Type': 'application/json' },
      );
      handlePostResponse(postResponse);
    }
    setBottomOfForm(signUpButton);
  }

  return (
    <div className='SignUpForm'>
      <h2 className={styles.h2}>Sign Up</h2>
      <form className={styles.form} onSubmit={signUp}>
        <input
          type='text'
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
        {bottomOfForm}
      </form>
      {submitMessage !== '' ? <div className={styles.submitMessage}>{submitMessage}</div> : null}
    </div>
  );
}
