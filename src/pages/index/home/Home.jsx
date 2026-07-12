// This is the component for the / page when the user is signed in.

import Navbar from '../../../components/navbar/Navbar';
import styles from './Home.module.css';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { postRequest } from '../../../../utilities';

export default function Home() {
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
    <div className='Home'>
      <Navbar />
      <main>
        <div className={styles.grid}>
          <div className={styles.row}>
            <Link to='/expenses' className={styles.col}>Expenses</Link>
            <Link to='/import' className={styles.col}>Import</Link>
            <button onClick={signOut} className={`${styles.col} ${styles.signOutButton}`}>
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
