// This is the component for the /import page.

import ExpensesTable from '../../components/expenses-table/ExpensesTable';
import Navbar from '../../components/navbar/Navbar';
import PageLoading from '../../components/page-loading/PageLoading';
import Spinner from '../../components/spinner/Spinner';
import { ImportMode } from '../../../constants';
import styles from './ImportPage.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { isAuthenticated, createAddSubmitMessageFunction, postRequest } from '../../../utilities';

export default function ImportPage() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileContents, setFileContents] = useState('');
  const [previewExpenses, setPreviewExpenses] = useState([]);
  const [isSubmittingPreview, setIsSubmittingPreview] = useState(false);
  const [previewSubmitMessages, setPreviewSubmitMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessages, setSubmitMessages] = useState([]);

  const addPreviewSubmitMessage = createAddSubmitMessageFunction(setPreviewSubmitMessages);
  const addSubmitMessage = createAddSubmitMessageFunction(setSubmitMessages);

  const navigate = useNavigate();
  const exampleCsvText = (
    'Date,Description,Amount,Categories\n'
    + '2025-01-01,CVS,20,Medicine,Health\n'
    + '2025-04-15,Netflix,20.99,Streaming Services,Entertainment\n'
    + '2025-07-10,Panda Express,15.5,Restaurants\n'
    + '2025-10-08,Panda Express Refund,-5,Restaurants\n'
    + '2025-12-01,Rent,1000,Bills,Living Expenses\n'
    + '2025-12-31,Whole Foods,24.01,Groceries'
  );

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

  function validInput(input) {
    return input !== '';
  }

  async function handlePreview200Response(response) {
    const previewExpenses = await response.json();
    setPreviewExpenses(previewExpenses);
  }
  async function handlePreview400Response(response) {
    const invalidRow = await response.text();
    addPreviewSubmitMessage(
      `Unsuccessful. Row ${invalidRow} in your file is invalid. Please check the instructions for `
      + `information on how to fix it.`
    );
  }
  function handlePreviewDefaultResponse() {
    addPreviewSubmitMessage('Sorry, an error occurred. Please try again later.');
  }
  async function handlePreviewResponse(response) {
    switch (response.status) {
      case 200:
        await handlePreview200Response(response);
        break;
      case 400:
        await handlePreview400Response(response);
        break;
      default:
        handlePreviewDefaultResponse();
    }
  }

  async function preview(fileContents) {
    setIsSubmittingPreview(true);
    if (!validInput(fileContents)) {
      addPreviewSubmitMessage('Please upload a valid file')
    } else {
      const postResponse = await postRequest(
        `/api/import?mode=${ImportMode.PREVIEW}`,
        JSON.stringify({ fileContents }),
        { 'Content-Type': 'application/json' },
        true,
      );
      await handlePreviewResponse(postResponse);
    }
    setIsSubmittingPreview(false);
  }

  function handleFileChange(event) {
    setPreviewExpenses([]);
    setPreviewSubmitMessages([]);
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
      addPreviewSubmitMessage('An error occurred with the file');
    };
    reader.readAsText(file);
  }

  function handleSubmit201Response() {
    addSubmitMessage(<>Success. View your expenses <Link to='/expenses'>here</Link>.</>);
  }
  function handleSubmitDefaultResponse() {
    addSubmitMessage('Sorry, an error occurred. Please try again later.');
  }
  function handleSubmitResponse(response) {
    switch (response.status) {
      case 201:
        handleSubmit201Response();
        break;
      default:
        handleSubmitDefaultResponse();
    }
  }

  async function save() {
    setIsSubmitting(true);
    const postResponse = await postRequest(
      `/api/import?mode=${ImportMode.SAVE}`,
      JSON.stringify({ fileContents }),
      { 'Content-Type': 'application/json' },
      true,
    );
    handleSubmitResponse(postResponse);
    setIsSubmitting(false);
  }

  if (isAuthenticatedState === null) {
    return <PageLoading />;
  }
  return (
    <div className='ImportPage'>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.h1}>Import</h1>
        <div className={styles.importInstructions}>
          <h2 className={styles.h2}>Instructions</h2>
          <ul className={styles.ul}>
            <li>Include a header row: Date,Description,Amount,Categories</li>
            <li>Do not include any blank rows</li>
            <li>
              Order the data by date,description,amount,categories with no spaces after commas
            </li>
            <li>
              For date, the format must be YYYY-MM-DD and for single digit months/days it has to
              start with a 0
            </li>
            <li>
              For description, if it includes a comma enclose it in double quotes. Ex:
              2025-01-01,"The, Spot",1,Restaurants
            </li>
            <li>
              Don't use double quotes within the description. Only use them around the whole
              description when it contains a comma.
            </li>
            <li>
              For amounts, dont include commas. Suggestion: use positive values for expenses you
              paid and negative values for expenses you received such as a return or refund.
            </li>
            <li>
              For multiple categories, separate them with commas. A category name cannot contain a
              comma.
            </li>
          </ul>
          <div className={styles.exampleContainer}>
            <span>Example:</span>
            <pre className={styles.pre}>{exampleCsvText}</pre>
          </div>
        </div>
        {isSubmittingPreview ?
          <Spinner styleClass={styles.previewSpinner} displayBlock={true} />
          : <>
            <label htmlFor='fileInput' className={styles.fileInputLabel}>Choose a file</label>
            <input
              type='file'
              className={styles.fileInput}
              id='fileInput'
              accept='.csv'
              onChange={handleFileChange}
            />
            <span className={styles.fileName}>{fileName}</span>
          </>
        }
        {previewSubmitMessages.map((message) => {
          return <div key={message} className={styles.message}>{message}</div>;
        })}
        {previewExpenses.length > 0 ?
          <>
            <h2 className={styles.h2}>Preview:</h2>
            <ExpensesTable expenses={previewExpenses} showButtons={false} />
            <button className={styles.submitButton} type='button' onClick={save}>
              {isSubmitting ? <Spinner styleClass={styles.submitSpinner} /> : 'Submit'}
            </button>
            {submitMessages.map((message) => {
              return <div key={message} className={styles.message}>{message}</div>;
            })}
          </>
          : null}
      </main>
    </div>
  );
}
