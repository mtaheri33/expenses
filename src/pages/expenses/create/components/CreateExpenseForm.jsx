// This is a create expense form component for the create expense page.

import Spinner from '../../../../components/spinner/Spinner';
import styles from './CreateExpenseForm.module.css';
import { useState } from 'react';
import { Link } from 'react-router';
import { createHandleInputChangeFunction, postRequest } from '../../../../../utilities';

export default function CreateExpenseForm() {
  const createButton = <button className={styles.createButton}>Create</button>;
  const spinner = <Spinner styleClass={styles.spinner} />;
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    categories: [''],
  });
  const handleInputChange = createHandleInputChangeFunction(setFormData);
  function handleCategoryInputChange(event, index) {
    setFormData((currentFormData) => {
      const currentFormDataCategoriesCopy = [...currentFormData.categories];
      currentFormDataCategoriesCopy[index] = event.target.value;
      return {
        ...currentFormData,
        categories: currentFormDataCategoriesCopy,
      };
    });
  }
  const [bottomOfForm, setBottomOfForm] = useState(createButton);
  const [submitMessage, setSubmitMessage] = useState('');

  function removeCategoryInput(index) {
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        categories: currentFormData.categories.filter((_, i) => i !== index),
      };
    });
  }

  function addCategoryInput() {
    setFormData((currentFormData) => {
      const currentFormDataCategoriesCopy = [...currentFormData.categories, ''];
      return {
        ...currentFormData,
        categories: currentFormDataCategoriesCopy,
      };
    });
  }

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

  async function createExpense(event) {
    event.preventDefault();
    setBottomOfForm(spinner);
    setSubmitMessage('');
    const postResponse = await postRequest(
      '/api/expenses',
      JSON.stringify(formData),
      { 'Content-Type': 'application/json' },
      true,
    );
    handlePostResponse(postResponse);
    setBottomOfForm(createButton);
  }

  function clearForm() {
    setFormData({
      date: '',
      description: '',
      amount: '',
      categories: [''],
    });
  }

  return (
    <div className={`CreateExpenseForm ${styles.CreateExpenseForm}`}>
      <h1 className={styles.h1}>Create Expense</h1>
      <form className={styles.form} onSubmit={createExpense}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor='createExpenseDate'>Date</label>
          <input
            type='date'
            className={styles.formInputDate}
            value={formData.date}
            onChange={handleInputChange}
            id='createExpenseDate'
            name='date'
            autoComplete='off'
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor='createExpenseDescription'>Description</label>
          <input
            type='text'
            className={styles.formInputText}
            value={formData.description}
            onChange={handleInputChange}
            id='createExpenseDescription'
            name='description'
            autoComplete='off'
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor='createExpenseAmount'>Amount</label>
          <input
            type='number'
            className={styles.formInputNumber}
            value={formData.amount}
            onChange={handleInputChange}
            id='createExpenseAmount'
            name='amount'
            autoComplete='off'
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.categoriesDiv}>Categories:</div>
          {formData.categories.map((category, index) => {
            return (
              <div key={index}>
                <input
                  type='text'
                  className={styles.formInputCategories}
                  value={category}
                  onChange={(event) => handleCategoryInputChange(event, index)}
                  id={`createExpenseCategory${index}`}
                  name={`category${index}`}
                  autoComplete='off'
                />
                <button
                  type='button'
                  className={styles.removeCategoryButton}
                  onClick={() => removeCategoryInput(index)}
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
      <div className={styles.clearFormContainer}>
        <span className={styles.clearFormSpan} onClick={clearForm}>Clear Form</span>
      </div>
    </div>
  );
}
