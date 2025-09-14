// This is a file upload form component for the import page.

import Spinner from '../../../components/spinner/Spinner';
import { useState } from 'react';
import { Link } from 'react-router';
import styles from './UploadFileForm.module.css';
import { postRequest } from '../../../../utilities';

export default function UploadFileForm() {
  const submitButton = <button className={styles.submitButton}>Submit</button>;
  const spinner = <Spinner styleClass={styles.spinner} />;
  const [formData, setFormData] = useState({ fileName: '', fileContents: '' });
  const [bottomOfForm, setBottomOfForm] = useState(submitButton);
  const [submitMessage, setSubmitMessage] = useState('');

  function handleDefaultResponse() {
    setSubmitMessage('Sorry, an error occurred. Please try again later.');
  }

  function handle201Response() {
    setSubmitMessage([
      'Success. View your expenses ',
      <Link key='expensesLink' to='/expenses'>here</Link>,
      '.',
    ]);
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

  function validInput(input) {
    return input !== '';
  }

  async function sendUpload(event) {
    event.preventDefault();
    setBottomOfForm(spinner);
    setSubmitMessage('');
    if (!validInput(formData.fileContents)) {
      setSubmitMessage('Please upload a valid file.');
    } else {
      const postResponse = await postRequest(
        '/api/import',
        JSON.stringify({ fileContents: formData.fileContents }),
        { 'Content-Type': 'application/json' },
        true,
      );
      handlePostResponse(postResponse);
    }
    setBottomOfForm(submitButton);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({ fileName: file.name, fileContents: e.target.result });
    };
    reader.onerror = (e) => {
      setSubmitMessage('An error occurred with the file.');
    };
    reader.readAsText(file);
  }

  return (
    <div className={`UploadFileForm ${styles.UploadFileForm}`}>
      <h1 className={styles.h1}>Import</h1>
      <form className={styles.form} onSubmit={sendUpload}>
        <div className={styles.fileInputContainer}>
          <label htmlFor='fileInput' className={styles.fileInputLabel}>Choose a file</label>
          <input
            type='file'
            className={styles.fileInput}
            id='fileInput'
            name='file'
            accept='.csv'
            onChange={handleFileChange}
          />
          {formData.fileName ? <span className={styles.fileName}>{formData.fileName}</span> : null}
        </div>
        {bottomOfForm}
      </form>
      {submitMessage ? <div className={styles.submitMessage}>{submitMessage}</div> : null}
    </div>
  );
}
