// This is a file input component for the import page.

import Spinner from '../../../components/spinner/Spinner';
import { ImportMode } from '../../../../constants';
import styles from './ImportFileInput.module.css';
import { useState } from 'react';
import { postRequest } from '../../../../utilities';

export default function ImportFileInput({
  setFileContents,
  setPreviewExpenses,
  setMessage,
}) {
  /*
  setFileContents required function(string)
  setPreviewExpenses required function(array [object {
    id required string,
    date required (nullable) string,
    description required string,
    amount required (nullable) number,
    categories required array [string],
  }])
  setMessage required function(string)
  */
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [fileName, setFileName] = useState('');

  function clearFile(event) {
    setFileName('');
    setFileContents('');
    setPreviewExpenses(null);
    setMessage('');
    // This allows a file to be reuploaded, otherwise choosing the same file again won't trigger
    // the file input's onchange function.
    event.target.value = null;
  }

  function validInput(input) {
    return input !== '';
  }

  async function handle200Response(response) {
    const previewExpenses = await response.json();
    setPreviewExpenses(previewExpenses);
  }

  async function handle400Response(response) {
    const invalidRow = await response.text();
    setMessage(
      `Unsuccessful. Row ${invalidRow} in your file is invalid. Please check the instructions for `
      + `information on how to fix it.`
    );
  }

  function handleDefaultResponse() {
    setMessage('Sorry, an error occurred. Please try again later.');
  }

  async function handlePostResponse(response) {
    switch (response.status) {
      case 200:
        await handle200Response(response);
        break;
      case 400:
        await handle400Response(response);
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function preview(fileContents) {
    setAwaitingResponse(true);
    if (!validInput(fileContents)) {
      setMessage('Please upload a valid file.')
    } else {
      const postResponse = await postRequest(
        `/api/import?mode=${ImportMode.PREVIEW}`,
        JSON.stringify({ fileContents }),
        { 'Content-Type': 'application/json' },
        true,
      );
      await handlePostResponse(postResponse);
    }
    setAwaitingResponse(false);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileName(file.name);
      const fileContents = e.target.result;
      setFileContents(fileContents)
      preview(fileContents);
    };
    reader.onerror = (e) => {
      setMessage('An error occurred with the file.');
    };
    reader.readAsText(file);
  }

  return (
    <div className='ImportFileInput'>
      <div className={styles.fileInputContainer}>
        <label htmlFor='fileInput' className={styles.fileInputLabel}>Choose a file</label>
        <input
          type='file'
          className={styles.fileInput}
          id='fileInput'
          name='file'
          accept='.csv'
          onClick={clearFile}
          onChange={handleFileChange}
        />
        {fileName}
      </div>
      {awaitingResponse ? <Spinner styleClass={styles.spinner} /> : null}
    </div>
  );
}
