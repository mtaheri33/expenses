// This is a grid component for the home page.

import { PageMessageType } from '../../../../../../constants';
import styles from './HomeGrid.module.css';
import { Link } from 'react-router';
import { postRequest } from '../../../../../../utilities';

export default function HomeGrid({ setPageMessageProperties }) {
  /*
  setPageMessageProperties required function(object {
    type required PageMessageType constant,
    message required HTML element,
    displayTime required number,
  })
  */
  function handleSignOutPostResponse(response) {
    if (response.status === 200) {
      window.location.reload();
    } else {
      setPageMessageProperties({
        type: PageMessageType.FAILURE,
        message: <span>Sorry, an error occurred. Please try again later.</span>,
        displayTime: 3000,
      });
    }
  }

  async function signOut() {
    const postResponse = await postRequest(
      '/api/signout',
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
        <button
          onClick={signOut}
          className={`${styles.col} ${styles.signOutButton}`}
        >Sign Out</button>
      </div>
    </div>
  );
}
