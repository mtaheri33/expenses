// This is a component for an expenses search form.

import { CategoryType } from '../../../constants';
import styles from './ExpensesSearchForm.module.css';
import { useState } from 'react';
import {
  createHandleInputChangeFunction,
  checkAmountInput,
  createAddSubmitMessageFunction,
} from '../../../utilities';

export default function ExpensesSearchForm({ searchExpensesFunction, userCategories }) {
  /*
  searchExpensesFunction required function(object)
  userCategories required array [string]
  */
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    description: '',
    fromAmount: '',
    toAmount: '',
    categoryType: CategoryType.INCLUDE,
    categories: [],
  });
  const [submitMessages, setSubmitMessages] = useState([]);

  const handleInputChange = createHandleInputChangeFunction(setFormData);
  function handleCategoryInputChange(event) {
    const category = event.target.value;
    if (formData.categories.includes(category)) {
      return;
    }
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        categories: [...currentFormData.categories, category],
      };
    });
  }
  const addSubmitMessage = createAddSubmitMessageFunction(setSubmitMessages);

  function validDates() {
    if (
      formData.fromDate !== ''
      && formData.toDate !== ''
      && formData.fromDate > formData.toDate
    ) {
      addSubmitMessage('From Date cannot be after To Date');
      return false;
    }
    return true;
  }
  function validAmounts() {
    if (
      formData.fromAmount !== ''
      && formData.toAmount !== ''
      && checkAmountInput(formData.fromAmount) > checkAmountInput(formData.toAmount)
    ) {
      addSubmitMessage('From Amount cannot be greater than To Amount');
      return false;
    }
    return true;
  }
  function validInputs() {
    const datesValid = validDates();
    const amountsValid = validAmounts();
    return datesValid && amountsValid;
  }

  function searchExpenses(event) {
    event.preventDefault();
    setSubmitMessages([]);
    if (!validInputs()) {
      return;
    }
    searchExpensesFunction(formData);
  }

  function addCategory(event) {
    handleCategoryInputChange(event);
    event.target.value = '';
  }
  function removeCategory(index) {
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        categories: currentFormData.categories.filter((_, i) => i !== index),
      };
    });
  }

  return (
    <form
      className={`ExpensesSearchForm ${styles.ExpensesSearchForm}`}
      autoComplete='off'
      onSubmit={searchExpenses}
    >
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor='expensesSearchFormFromDate'>From Date</label>
        <input
          type='date'
          className={styles.dateInput}
          value={formData.fromDate}
          onChange={handleInputChange}
          id='expensesSearchFormFromDate'
          name='fromDate'
        />
        <label className={styles.label} htmlFor='expensesSearchFormToDate'>To Date</label>
        <input
          type='date'
          className={styles.dateInput}
          value={formData.toDate}
          onChange={handleInputChange}
          id='expensesSearchFormToDate'
          name='toDate'
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor='expensesSearchFormDescription'>Description</label>
        <input
          type='text'
          className={styles.textInput}
          value={formData.description}
          onChange={handleInputChange}
          id='expensesSearchFormDescription'
          name='description'
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor='expensesSearchFormFromAmount'>From Amount</label>
        <input
          type='number'
          className={styles.numberInput}
          value={formData.fromAmount}
          onChange={handleInputChange}
          id='expensesSearchFormFromAmount'
          name='fromAmount'
          onWheel={(event) => event.target.blur()}
        />
        <label className={styles.label} htmlFor='expensesSearchFormToAmount'>To Amount</label>
        <input
          type='number'
          className={styles.numberInput}
          value={formData.toAmount}
          onChange={handleInputChange}
          id='expensesSearchFormToAmount'
          name='toAmount'
          onWheel={(event) => event.target.blur()}
        />
      </div>
      <div className={styles.formRow}>
        <span className={styles.label}>Categories</span>
        <select
          className={styles.selectInputCategoryType}
          value={formData.categoryType}
          onChange={handleInputChange}
          name='categoryType'
        >
          <option value={CategoryType.INCLUDE}>Include</option>
          <option value={CategoryType.EXCLUDE}>Exclude</option>
        </select>
        <select
          className={styles.selectInput}
          onChange={addCategory}
          id='expensesSearchFormCategories'
        >
          <option value=''></option>
          {userCategories.map((category) => {
            return <option key={category} value={category}>{category}</option>;
          })}
        </select>
        {formData.categories.map((category, index) => {
          return (
            <span key={category}>
              <span
                className='clickableSpan'
                onClick={() => removeCategory(index)}
              >
                {category}
              </span>
              {index !== formData.categories.length - 1 ? <span> | </span> : null}
            </span>
          );
        })}
      </div>
      {submitMessages.map((message) => {
        return <div key={message} className={styles.submitMessage}>{message}</div>;
      })}
      <button className={styles.searchButton}>Search</button>
    </form>
  );
}
