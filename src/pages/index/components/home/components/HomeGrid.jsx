// This is a grid component for the home page.

import styles from './HomeGrid.module.css';
import { Link } from 'react-router';
import { postRequest } from '../../../../../../utilities';

export default function HomeGrid() {
  function handlePostResponse(response) {
    if (response.status === 200) {
      window.location.reload();
    }
  }

  async function signOut() {
    const postResponse = await postRequest(
      '/api/signout',
      JSON.stringify({}),
      undefined,
      true,
    );
    handlePostResponse(postResponse);
  }

  return (
    <div className={'HomeGrid ' + styles.grid}>
      <div className={styles.row}>
        <Link to='/expenses' className={styles.col}>Expenses</Link>
        <button
          onClick={signOut}
          className={styles.col + ' ' + styles.signOutButton}
        >Sign Out</button>
      </div>
    </div>
  );
}
