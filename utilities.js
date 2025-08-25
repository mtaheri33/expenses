// This contains code used throughout the files.

function createHandleInputChangeFunction(setStateFunction) {
  return function handleInputChange(event) {
    setStateFunction((currentFormData) => {
      const currentFormDataCopy = { ...currentFormData };
      if (
        event.target.type === 'text'
        || event.target.type === 'password'
        || event.target.type === 'date'
        || event.target.type === 'number'
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

async function isAuthenticated() {
  const response = await getRequest(
    '/api/session',
    undefined,
    true,
  );
  if (response.status === 200) {
    return await response.json();
  }
  return false;
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
  const filteredCategories = categoriesInput.filter((category) => category !== '');
  return filteredCategories.map((category) => category.trim());
}

export {
  createHandleInputChangeFunction,
  getRequest,
  postRequest,
  isAuthenticated,
  checkStringInput,
  checkAmountInput,
  checkCategoriesInput,
};
