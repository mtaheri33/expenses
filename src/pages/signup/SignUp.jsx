// This is the component for the /signup page.

import './SignUp.css';

export default function SignUp() {
  return (
    <div className='SignUp'>
      <h1><div id='expensesHeader'>Expenses</div></h1>
      <h2>Sign Up</h2>
      <form>
        <input type='text' placeholder='Email' autoFocus />
        <input type='password' placeholder='Password' />
        <button id='signUpButton'>Sign Up</button>
      </form>
    </div>
  );
}
