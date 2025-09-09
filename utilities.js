// This contains code used throughout the files.

import { SortOrder } from './constants.js';

const numberFormatter = new Intl.NumberFormat('en-US');

function createHandleInputChangeFunction(setStateFunction) {
  return function handleInputChange(event) {
    setStateFunction((currentFormData) => {
      const currentFormDataCopy = { ...currentFormData };
      if (
        event.target.type === 'text'
        || event.target.type === 'password'
        || event.target.type === 'date'
        || event.target.type === 'number'
        || event.target.type === 'email'
      ) {
        currentFormDataCopy[event.target.name] = event.target.value;
      }
      return currentFormDataCopy;
    });
  }
}

async function getRequest(url, headers = {}, includeCredentials = false) {
  try {
    return await fetch(url, {
      method: 'GET',
      headers,
      credentials: includeCredentials ? 'include' : 'omit',
    });
  } catch {
    return { status: 0 };
  }
}

async function postRequest(url, body, headers = {}, includeCredentials = false) {
  try {
    return await fetch(url, {
      method: 'POST',
      body,
      headers,
      credentials: includeCredentials ? 'include' : 'omit',
    });
  } catch {
    return { status: 0 };
  }
}

async function patchRequest(url, body, headers = {}, includeCredentials = false) {
  try {
    return await fetch(url, {
      method: 'PATCH',
      body,
      headers,
      credentials: includeCredentials ? 'include' : 'omit',
    });
  } catch {
    return { status: 0 };
  }
}

async function deleteRequest(url, headers = {}, includeCredentials = false) {
  try {
    return await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: includeCredentials ? 'include' : 'omit',
    });
  } catch {
    return { status: 0 };
  }
}

async function isAuthenticated() {
  const response = await getRequest(
    '/api/session',
    undefined,
    true,
  );
  return response.status === 200;
}

function checkStringInput(stringInput) {
  return stringInput.trim();
}

function checkAmountInput(amountInput) {
  if (amountInput === '') {
    return null;
  }
  const amount = Number(amountInput);
  const amountRoundedToTwoDecimalPlaces = Math.floor(Math.abs(amount) * 100) / 100;
  if (amount < 0) {
    return -1 * amountRoundedToTwoDecimalPlaces;
  }
  return amountRoundedToTwoDecimalPlaces;
}

function checkCategoriesInput(categoriesInput) {
  const trimmedCategories = categoriesInput.map((category) => category.trim());
  return trimmedCategories.filter((category) => category !== '');
}

function formatDateForDisplay(date) {
  /*
  date should be a string in the format YYYY-MM-DD.  For single digit months or days, it should
  start with 0.
  */
  if (!date) {
    return '';
  }
  const [year, month, day] = date.split('-');
  return `${parseInt(month)}-${parseInt(day)}-${year}`;
}

function formatAmountForDisplay(amount) {
  if (amount === null) {
    return '';
  }
  return numberFormatter.format(amount);
}

function sortExpensesByDate(expenses, sortOrder) {
  expenses.sort((a, b) => {
    if (!a.date && !b.date) {
      return 0;
    }
    if (!a.date) {
      return 1;
    }
    if (!b.date) {
      return -1;
    }
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    if (sortOrder === SortOrder.ASC) {
      return aDate - bDate;
    }
    return bDate - aDate;
  });
}

function sortExpensesByDescription(expenses, sortOrder) {
  expenses.sort((a, b) => {
    if (!a.description && !b.description) {
      return 0;
    }
    if (!a.description) {
      return 1;
    }
    if (!b.description) {
      return -1;
    }
    const aDescription = a.description.toLowerCase();
    const bDescription = b.description.toLowerCase();
    if (sortOrder === SortOrder.ASC) {
      return aDescription.localeCompare(bDescription);
    }
    return bDescription.localeCompare(aDescription);
  });
}

function sortExpensesByAmount(expenses, sortOrder) {
  expenses.sort((a, b) => {
    const aNull = a.amount === null;
    const bNull = b.amount === null;
    if (aNull && bNull) {
      return 0;
    }
    if (aNull) {
      return 1;
    }
    if (bNull) {
      return -1;
    }
    if (sortOrder === SortOrder.ASC) {
      return a.amount - b.amount;
    }
    return b.amount - a.amount;
  });
}

function generateId() {
  return crypto.randomUUID();
}

export {
  createHandleInputChangeFunction,
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
  isAuthenticated,
  checkStringInput,
  checkAmountInput,
  checkCategoriesInput,
  formatDateForDisplay,
  formatAmountForDisplay,
  sortExpensesByDate,
  sortExpensesByDescription,
  sortExpensesByAmount,
  generateId,
};
