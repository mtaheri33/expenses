// This is a component for an expense form.

import ClearButton from '../clear-button/ClearButton';
import { RequestMethod } from '../../../constants';
import styles from './ExpenseForm.module.css';
import { useState } from 'react';
import { Link } from 'react-router';
import Spinner from '../spinner/Spinner';
import {
  createHandleInputChangeFunction,
  postRequest,
  patchRequest,
  generateId,
  createAddSubmitMessageFunction,
  checkStringInput,
  checkAmountInput,
} from '../../../utilities';

export default function ExpenseForm({ expenseData, requestMethod, requestUrl }) {
  /*
  expenseData required object
  requestMethod required RequestMethod constant
  requestUrl required string
  */
  const [formData, setFormData] = useState({
    date: expenseData.date,
    description: expenseData.description,
    amount: expenseData.amount,
    categories: expenseData.categories.map((category) => {
      return { id: generateId(), category };
    }),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessages, setSubmitMessages] = useState([]);

  const handleInputChange = createHandleInputChangeFunction(setFormData);
  function handleCategoryInputChange(event, categoryObjectId) {
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        categories: currentFormData.categories.map((categoryObject) => {
          if (categoryObject.id === categoryObjectId) {
            return { ...categoryObject, category: event.target.value };
          }
          return categoryObject;
        }),
      };
    });
  }
  const addSubmitMessage = createAddSubmitMessageFunction(setSubmitMessages);

  function validDate() {
    if (formData.date === '') {
      addSubmitMessage('Date is required');
      return false;
    }
    return true;
  }
  function validDescription() {
    if (checkStringInput(formData.description) === '') {
      addSubmitMessage('Description is required');
      return false;
    }
    return true;
  }
  function validAmount() {
    if (checkAmountInput(formData.amount) === null) {
      addSubmitMessage('Amount is required');
      return false;
    }
    return true;
  }
  function validInputs() {
    const dateValid = validDate();
    const descriptionValid = validDescription();
    const amountValid = validAmount();
    return dateValid && descriptionValid && amountValid;
  }

  function handleSuccessResponse() {
    addSubmitMessage(<>Success. View your expenses <Link to='/expenses'>here</Link>.</>);
  }
  function handleDefaultResponse() {
    addSubmitMessage('Sorry, an error occurred. Please try again later.');
  }
  function handleResponse(response) {
    switch (response.status) {
      case 200:
      case 201:
        handleSuccessResponse();
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function submitExpense(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessages([]);
    if (validInputs()) {
      const data = JSON.stringify({
        ...formData,
        categories: formData.categories.map((categoryObject) => categoryObject.category),
      });
      const requestFunction = requestMethod === RequestMethod.POST ? postRequest : patchRequest;
      const response = await requestFunction(
        requestUrl,
        data,
        { 'Content-Type': 'application/json' },
        true,
      );
      handleResponse(response);
    }
    setIsSubmitting(false);
  }

  function addCategoryInput() {
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        categories: [...currentFormData.categories, { id: generateId(), category: '' }],
      };
    });
  }
  function removeCategoryInput(categoryObjectId) {
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        categories: currentFormData.categories.filter((categoryObject) => {
          return categoryObject.id !== categoryObjectId;
        }),
      };
    });
  }

  function clearForm() {
    setFormData({
      date: '',
      description: '',
      amount: '',
      categories: [{ id: generateId(), category: '' }],
    });
  }

  return (
    <form
      className={`ExpenseForm ${styles.ExpenseForm}`}
      autoComplete='off'
      onSubmit={submitExpense}
    >
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor='expenseFormDate'>Date*</label>
        <input
          type='date'
          className={styles.dateInput}
          value={formData.date}
          onChange={handleInputChange}
          id='expenseFormDate'
          name='date'
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor='expenseFormDescription'>Description*</label>
        <input
          type='text'
          className={styles.textInput}
          value={formData.description}
          onChange={handleInputChange}
          id='expenseFormDescription'
          name='description'
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor='expenseFormAmount'>Amount*</label>
        <input
          type='number'
          className={styles.numberInput}
          value={formData.amount}
          onChange={handleInputChange}
          id='expenseFormAmount'
          name='amount'
          onWheel={(event) => event.target.blur()}
        />
      </div>
      <div className={styles.formRow}>
        <span className={`${styles.label} ${styles.categoriesSpan}`}>Categories:</span>
        {formData.categories.map((categoryObject) => {
          return (
            <div key={categoryObject.id} className={styles.categoryRow}>
              <input
                type='text'
                className={styles.categoryInput}
                value={categoryObject.category}
                onChange={(event) => handleCategoryInputChange(event, categoryObject.id)}
                id={`expenseFormCategory${categoryObject.id}`}
              />
              <ClearButton
                onClick={() => removeCategoryInput(categoryObject.id)}
                styleClass={styles.removeCategoryButton}
              />
            </div>
          );
        })}
        <div>
          <span className={`clickableSpan ${styles.addCategorySpan}`} onClick={addCategoryInput}>
            Add Category
          </span>
        </div>
      </div>
      <button className={styles.saveButton}>
        {isSubmitting ? <Spinner styleClass={styles.spinner} /> : 'Save'}
      </button>
      {submitMessages.map((message) => {
        return <div key={message} className={styles.submitMessage}>{message}</div>;
      })}
      <div className={styles.clearFormContainer}>
        <span className={`clickableSpan ${styles.clearFormSpan}`} onClick={clearForm}>
          Clear Form
        </span>
      </div>
    </form>
  );
}
