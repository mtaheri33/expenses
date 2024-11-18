// This is the component for the / page when the user is not signed in.

import './SignIn.css';

export default function SignIn() {
  return (
    <div className='SignIn'>
      <h1><div id='expensesHeader'>Expenses</div></h1>
      <h2>Sign In</h2>
      <form>
        <input type='text' placeholder='Email' />
        <input type='password' placeholder='Password' />
        <button id='signInButton'>Sign In</button>
      </form>
      <div id='forgotPasswordContainer'>
        <span id='forgotPasswordMessage'>Forgot password?</span>
      </div>
      <a id='signUpLink'>Sign Up</a>
    </div>
  );
}
