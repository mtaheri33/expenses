// This is the component for any page the user goes to that doesn't load properly.

import { Link } from 'react-router';

export default function ErrorPage() {
  return (
    <div className='ErrorPage'>
      <span>Sorry, an error occurred. Please try again later. <Link to='/'>Home</Link></span>
    </div>
  );
}
