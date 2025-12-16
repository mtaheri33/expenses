// This is the component for the /import page.

import ImportFileInput from './components/ImportFileInput';
import ImportInstructions from './components/ImportInstructions';
import ImportPreview from './components/ImportPreview';
import Navbar from '../../components/navbar/Navbar';
import PageLoading from '../../components/page-loading/PageLoading';
import styles from './ImportPage.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isAuthenticated } from '../../../utilities';

export default function ImportPage() {
  const navigate = useNavigate();
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [fileContents, setFileContents] = useState('');
  const [previewExpenses, setPreviewExpenses] = useState(null);
  const [message, setMessage] = useState('');

  async function checkIsAuthenticated() {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      setIsAuthenticatedState(true);
    } else {
      navigate('/');
    }
  }
  useEffect(() => {
    checkIsAuthenticated();
  }, []);

  if (isAuthenticatedState === null) {
    return <PageLoading />;
  }
  return (
    <div className='ImportPage'>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.h1}>Import</h1>
        <ImportInstructions />
        <ImportFileInput
          setFileContents={setFileContents}
          setPreviewExpenses={setPreviewExpenses}
          setMessage={setMessage}
        />
        <ImportPreview
          fileContents={fileContents}
          previewExpenses={previewExpenses}
          setMessage={setMessage}
        />
        {message ? <div className={styles.message}>{message}</div> : null}
      </main>
    </div>
  );
}
