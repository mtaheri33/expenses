// This is a grid component for the home page.

import styles from './HomeGrid.module.css';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { postRequest } from '../../../../../../utilities';

export default function HomeGrid() {
  function handleSignOutPostResponse(response) {
    if (response.status === 200) {
      window.location.reload();
    } else {
      toast.error('Sorry, an error occurred. Please try again later.');
    }
  }

  async function signOut() {
    const postResponse = await postRequest(
      '/api/sign-out',
      JSON.stringify({}),
      undefined,
      true,
    );
    handleSignOutPostResponse(postResponse);
  }

  return (
    <div className={`HomeGrid ${styles.grid}`}>
      <div className={styles.row}>
        <Link to='/expenses' className={styles.col}>Expenses</Link>
        <Link to='/import' className={styles.col}>Import</Link>
        <button
          onClick={signOut}
          className={`${styles.col} ${styles.signOutButton}`}
        >Sign Out</button>
      </div>
    </div>
  );
}
