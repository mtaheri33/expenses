// This contains code used throughout the files.

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
  const amountRoundedDownToTwoDecimalPlaces = Math.floor(Math.abs(amount) * 100) / 100;
  if (amount < 0) {
    return -1 * amountRoundedDownToTwoDecimalPlaces;
  }
  return amountRoundedDownToTwoDecimalPlaces;
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

function generateId() {
  return crypto.randomUUID();
}

function parseImportRow(row) {
  if (row.split(',').length < 4) {
    return;
  }

  const data = {};
  let i = 0;

  let date = '';
  while (row[i] !== ',' && i < row.length) {
    date += row[i];
    i += 1;
  }
  data.date = date;
  i += 1;

  let description = '';
  let descriptionEndValue;
  if (row[i] === '"') {
    descriptionEndValue = '"';
    i += 1;
  } else {
    descriptionEndValue = ',';
  }
  while (row[i] !== descriptionEndValue && i < row.length) {
    description += row[i];
    i += 1;
  }
  data.description = description;
  if (descriptionEndValue === '"') {
    i += 1;
  }
  i += 1;

  let amount = '';
  while (row[i] !== ',' && i < row.length) {
    amount += row[i];
    i += 1;
  }
  data.amount = amount;
  i += 1;

  data.categories = row.substr(i).split(',');

  return data;
}

function parseImportFileContents(fileContents) {
  const parsedFileContents = [];
  const rows = fileContents.split('\n');
  for (let i = 1; i < rows.length; i += 1) {
    const row = parseImportRow(rows[i]);
    if (row) {
      parsedFileContents.push(row);
    } else {
      return i + 1;
    }
  }
  return parsedFileContents;
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
  generateId,
  parseImportFileContents,
};
