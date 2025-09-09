// This is an update expense form component for an expense's page.

import Spinner from '../../../../components/spinner/Spinner';
import { useState } from 'react';
import { Link } from 'react-router';
import styles from './UpdateExpenseForm.module.css';
import {
  createHandleInputChangeFunction,
  patchRequest,
  generateId,
} from '../../../../../utilities';

export default function UpdateExpenseForm({ expense }) {
  /*
  expense required object {
    id required string,
    date required (nullable) string,
    description required string,
    amount required (nullable) number,
    categories required array [string],
  }
  */
  const saveButton = <button className={styles.saveButton}>Save</button>;
  const spinner = <Spinner styleClass={styles.spinner} />;
  const [formData, setFormData] = useState({
    date: expense.date ? expense.date : '',
    description: expense.description,
    amount: expense.amount === null ? '' : String(expense.amount),
    categories: expense.categories.map((category) => {
      return {
        id: generateId(),
        category,
      };
    }),
  });
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
  const [bottomOfForm, setBottomOfForm] = useState(saveButton);
  const [submitMessage, setSubmitMessage] = useState('');

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

  function addCategoryInput() {
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        categories: [...currentFormData.categories, { id: generateId(), category: '' }],
      };
    });
  }

  function handleDefaultResponse() {
    setSubmitMessage('Sorry, an error occurred. Please try again later.');
  }

  function handle200Response() {
    setSubmitMessage([
      'Success. View your expenses ',
      <Link key='expensesLink' to='/expenses'>here</Link>,
      '.',
    ]);
  }

  function handlePatchResponse(response) {
    switch (response.status) {
      case 200:
        handle200Response();
        break;
      default:
        handleDefaultResponse();
    }
  }

  async function updateExpense(event) {
    event.preventDefault();
    setBottomOfForm(spinner);
    setSubmitMessage('');
    const patchResponse = await patchRequest(
      `/api/expenses/${expense.id}`,
      JSON.stringify({
        ...formData,
        categories: formData.categories.map((categoryObject) => categoryObject.category),
      }),
      { 'Content-Type': 'application/json' },
      true,
    );
    handlePatchResponse(patchResponse);
    setBottomOfForm(saveButton);
  }

  return (
    <div className={`UpdateExpenseForm ${styles.UpdateExpenseForm}`}>
      <h1 className={styles.h1}>Edit Expense</h1>
      <form className={styles.form} onSubmit={updateExpense}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor='updateExpenseDate'>Date</label>
          <input
            type='date'
            className={styles.formInputDate}
            value={formData.date}
            onChange={handleInputChange}
            id='updateExpenseDate'
            name='date'
            autoComplete='off'
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor='updateExpenseDescription'>Description</label>
          <input
            type='text'
            className={styles.formInputText}
            value={formData.description}
            onChange={handleInputChange}
            id='updateExpenseDescription'
            name='description'
            autoComplete='off'
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor='updateExpenseAmount'>Amount</label>
          <input
            type='number'
            className={styles.formInputNumber}
            value={formData.amount}
            onChange={handleInputChange}
            id='updateExpenseAmount'
            name='amount'
            autoComplete='off'
            onWheel={(event) => event.target.blur()}
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.categoriesDiv}>Categories:</div>
          {formData.categories.map((categoryObject) => {
            return (
              <div key={categoryObject.id}>
                <input
                  type='text'
                  className={styles.formInputCategories}
                  value={categoryObject.category}
                  onChange={(event) => handleCategoryInputChange(event, categoryObject.id)}
                  id={`updateExpenseCategory${categoryObject.id}`}
                  name={`category${categoryObject.id}`}
                  autoComplete='off'
                />
                <button
                  type='button'
                  className={styles.removeCategoryButton}
                  onClick={() => removeCategoryInput(categoryObject.id)}
                >
                  x</button>
              </div>
            );
          })}
          <span className={styles.addCategorySpan} onClick={addCategoryInput}>Add Category</span>
        </div>
        {bottomOfForm}
      </form>
      {submitMessage !== '' ? <div className={styles.submitMessage}>{submitMessage}</div> : null}
    </div>
  );
}
