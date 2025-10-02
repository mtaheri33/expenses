// This is an import expenses preview component for the import page.

import ExpensesTable from '../../../components/expenses-table/ExpensesTable';
import Spinner from '../../../components/spinner/Spinner';
import { ImportMode } from '../../../../constants';
import styles from './ImportPreview.module.css';
import { useState } from 'react';
import { Link } from 'react-router';
import { postRequest } from '../../../../utilities';

export default function ImportPreview({
  fileContents,
  previewExpenses,
  setMessage,
}) {
  /*
  fileContents required string
  previewExpenses required (nullable) array [object {
    id required string,
    date required (nullable) string,
    description required string,
    amount required (nullable) number,
    categories required array [string],
  }]
  setMessage required function(string)
  */
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  function handle201Response() {
    setMessage([
      'Success. View your expenses ',
      <Link key='expensesLink' to='/expenses'>here</Link>,
      '.',
    ]);
  }

  function handleDefaultResponse() {
    setMessage('Sorry, an error occurred. Please try again later.');
  }

  function handlePostResponse(response) {
    switch (response.status) {
      case 201:
        handle201Response();
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function save() {
    setAwaitingResponse(true);
    const postResponse = await postRequest(
      `/api/import?mode=${ImportMode.SAVE}`,
      JSON.stringify({ fileContents }),
      { 'Content-Type': 'application/json' },
      true,
    );
    handlePostResponse(postResponse);
    setAwaitingResponse(false);
  }

  if (previewExpenses === null) {
    return;
  }
  return (
    <div className='ImportPreview'>
      <h2 className={styles.h2}>Preview:</h2>
      <ExpensesTable expenses={previewExpenses} showButtons={false} />
      <div className={styles.buttonContainer}>
        {awaitingResponse ?
          <Spinner styleClass={styles.spinner} />
          : <button
            className={styles.submitButton}
            type='button'
            onClick={save}
          >
            Submit
          </button>
        }
      </div>
    </div>
  );
}
