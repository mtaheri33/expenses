// This is a search form component for the expenses page.

import { CategoryType } from '../../../../constants';
import styles from './ExpensesSearchForm.module.css';
import { useState } from 'react';
import { checkAmountInput } from '../../../../utilities';

export default function ExpensesSearchForm({
  formData,
  handleInputChange,
  handleCategoryInputChange,
  searchExpensesFunction,
  userCategories,
}) {
  /*
  formData required object {
    fromDate required string,
    toDate required string,
    description required string,
    fromAmount required string,
    toAmount required string,
    categoryType required CategoryType constant,
    categories required array [string],
  }
  handleInputChange required function(event)
  handleCategoryInputChange required function(event)
  searchExpensesFunction required function()
  userCategories required array [string]
  */
  const [submitMessage, setSubmitMessage] = useState('');

  function validInputs() {
    if (
      formData.fromDate !== ''
      && formData.toDate !== ''
      && formData.fromDate > formData.toDate
    ) {
      setSubmitMessage('From Date cannot be after To Date.');
      return false;
    }
    if (
      formData.fromAmount !== ''
      && formData.toAmount !== ''
      && checkAmountInput(formData.fromAmount) > checkAmountInput(formData.toAmount)
    ) {
      setSubmitMessage('From Amount cannot be greater than To Amount.');
      return false;
    }
    if (formData.categories.length > 0 && !formData.categoryType) {
      setSubmitMessage('Please select whether to include or exclude the categories.');
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

  function addCategory(event) {
    handleCategoryInputChange(event);
    event.target.value = '';
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
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor='searchFormFromAmount'>From Amount</label>
        <input
          type='number'
          className={styles.formInputNumber}
          value={formData.fromAmount}
          onChange={handleInputChange}
          id='searchFormFromAmount'
          name='fromAmount'
          autoComplete='off'
          onWheel={(event) => event.target.blur()}
        />
        <label className={styles.label} htmlFor='searchFormToAmount'>To Amount</label>
        <input
          type='number'
          className={styles.formInputNumber}
          value={formData.toAmount}
          onChange={handleInputChange}
          id='searchFormToAmount'
          name='toAmount'
          autoComplete='off'
          onWheel={(event) => event.target.blur()}
        />
      </div>
      <div className={styles.formGroup}>
        <select
          className={styles.formInputSelect}
          value={formData.categoryType}
          onChange={handleInputChange}
          id='searchFormCategoryType'
          name='categoryType'
        >
          <option value=''></option>
          <option value={CategoryType.INCLUDE}>Include</option>
          <option value={CategoryType.EXCLUDE}>Exclude</option>
        </select>
        <label className={styles.label} htmlFor='searchFormCategories'>Categories</label>
        <select
          className={styles.formInputSelect}
          onChange={addCategory}
          id='searchFormCategories'
        >
          <option value=''></option>
          {userCategories.map((category) => {
            return <option key={category} value={category}>{category}</option>;
          })}
        </select>
      </div>
      <button className={styles.searchButton}>Search</button>
      {submitMessage !== '' ? <div className={styles.submitMessage}>{submitMessage}</div> : null}
    </form>
  );
}
