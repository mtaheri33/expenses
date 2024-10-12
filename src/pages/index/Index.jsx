// This is the component for the / page.

import './Index.css';

export default function Index() {
  return (
    <div className='Index'>
      <h1>Expenses</h1>
      <h2>Sign In</h2>
      <form>
        <input type="text" placeholder='Email' /><br />
        <input type="password" placeholder='Password' /><br />
        <button>Sign In</button><br />
      </form>
      <span>Forgot password?</span><br />
      <a>Sign Up</a>
    </div>
  );
}
