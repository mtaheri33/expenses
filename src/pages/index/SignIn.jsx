// This is the component for the / page when the user is not signed in.

import Spinner from '../../components/spinner/Spinner';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styles from './SignIn.module.css';
import { postRequest } from '../../utilities';

export default function SignIn({ setIsSignedIn }) {
  const signInButton = <button className={styles.signInButton}>Sign In</button>;
  const spinner = <Spinner styleClass={styles.signInSpinner} />;
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [bottomOfSignInForm, setBottomOfSignInForm] = useState(signInButton);
  const [submitMessage, setSubmitMessage] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(null);
  const navigate = useNavigate();

  function handlePostResponse(response) {
    switch (response.status) {
      case 200:
        setIsSignedIn(true);
        navigate('/');
        break;
      case 400:
        setSubmitMessage('The email or password is incorrect.');
        break;
      default:
        setSubmitMessage('Sorry, an error occurred. Please try again later.');
    }
    return;
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
    setBottomOfSignInForm(spinner);
    setSubmitMessage('');
    if (!validInputs(formData)) {
      setSubmitMessage('Please fill out all fields.');
    } else {
      const postResponse = await postRequest(
        import.meta.env.VITE_SERVER_ADDRESS + '/signin',
        JSON.stringify(formData),
        { 'Content-Type': 'application/json' }
      );
      handlePostResponse(postResponse);
    }
    setBottomOfSignInForm(signInButton);
    return;
  }

  function handleInputChange(event) {
    setFormData((currentFormData) => {
      const currentFormDataCopy = { ...currentFormData };
      currentFormDataCopy[event.target.name] = event.target.value;
      return currentFormDataCopy;
    });
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
        <input type='text' value={formData.email} onChange={handleInputChange}
          name='email' placeholder='Email' autoFocus />
        <input type='password' value={formData.password} onChange={handleInputChange}
          name='password' placeholder='Password' />
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
