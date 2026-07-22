// This is the component for any page that doesn't exist.

import { Link } from 'react-router';

export default function InvalidPage() {
  return (
    <div className='InvalidPage'>
      <span>This page does not exist. <Link to='/'>Home</Link></span>
    </div>
  );
}
