// This is a search form component for the expenses page.

import styles from './ExpensesSearchForm.module.css';
import { useState } from 'react';

export default function ExpensesSearchForm({
  formData,
  handleInputChange,
  searchExpensesFunction,
}) {
  /*
  formData required object {
    fromDate required string,
    toDate required string,
    description required string,
  }
  handleInputChange required function(event)
  searchExpensesFunction required function()
  */
  const [submitMessage, setSubmitMessage] = useState('');

  function validInputs() {
    if (
      formData.fromDate !== ''
      && formData.toDate !== ''
      && formData.fromDate > formData.toDate
    ) {
      setSubmitMessage('From Date cannot be after To Date');
      return false;
    }
    setSubmitMessage('');
    return true;
  }

  function searchExpenses(event) {
    event.preventDefault();
    if (!validInputs()) {
      return;
    }
    searchExpensesFunction();
  }

  return (
    <form className={`ExpensesSearchForm ${styles.ExpensesSearchForm}`} onSubmit={searchExpenses}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor='searchFormFromDate'>From Date</label>
        <input
          type='date'
          className={styles.formInputDate}
          value={formData.fromDate}
          onChange={handleInputChange}
          id='searchFormFromDate'
          name='fromDate'
          autoComplete='off'
        />
        <label className={styles.label} htmlFor='searchFormToDate'>To Date</label>
        <input
          type='date'
          className={styles.formInputDate}
          value={formData.toDate}
          onChange={handleInputChange}
          id='searchFormToDate'
          name='toDate'
          autoComplete='off'
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor='searchFormDescription'>Description</label>
        <input
          type='text'
          className={styles.formInputText}
          value={formData.description}
          onChange={handleInputChange}
          id='searchFormDescription'
          name='description'
          autoComplete='off'
        />
      </div>
      <button className={styles.searchButton}>Search</button>
      {submitMessage !== '' ? <div className={styles.submitMessage}>{submitMessage}</div> : null}
    </form>
  );
}
