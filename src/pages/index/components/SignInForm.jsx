// This is a form component of the / page when the user is not signed in.

import Spinner from '../../../components/spinner/Spinner';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './SignInForm.module.css';
import { postRequest } from '../../../utilities';

export default function SignInForm({ setIsSignedIn }) {
  /*
  setIsSignedIn required function(boolean)
  */

  const signInButton = <button className={styles.signInButton}>Sign In</button>;
  const spinner = <Spinner styleClass={styles.spinner} />;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [bottomOfForm, setBottomOfForm] = useState(signInButton);
  const [submitMessage, setSubmitMessage] = useState('');

  function handleDefaultResponse() {
    setSubmitMessage('Sorry, an error occurred. Please try again later.');
  }

  function handle400Response() {
    setSubmitMessage('The email or password is incorrect.');
  }

  function handle200Response() {
    setIsSignedIn(true);
    navigate('/');
  }

  function handlePostResponse(response) {
    switch (response.status) {
      case 200:
        handle200Response();
        break;
      case 400:
        handle400Response();
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

  async function signIn(event) {
    event.preventDefault();
    setBottomOfForm(spinner);
    setSubmitMessage('');
    if (!validInputs(formData)) {
      setSubmitMessage('Please fill out all fields.');
    } else {
      const postResponse = await postRequest(
        import.meta.env.VITE_SERVER_ADDRESS + '/signin',
        JSON.stringify(formData),
        { 'Content-Type': 'application/json' },
      );
      handlePostResponse(postResponse);
    }
    setBottomOfForm(signInButton);
  }

  function handleInputChange(event) {
    setFormData((currentFormData) => {
      const currentFormDataCopy = { ...currentFormData };
      currentFormDataCopy[event.target.name] = event.target.value;
      return currentFormDataCopy;
    });
  }

  return (
    <div className='SignInForm'>
      <h2 className={styles.h2}>Sign In</h2>
      <form className={styles.form} onSubmit={signIn}>
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
          autoComplete='current-password'
        />
        {bottomOfForm}
      </form>
      {submitMessage !== '' ? <div className={styles.submitMessage}>{submitMessage}</div> : null}
    </div>
  );
}
