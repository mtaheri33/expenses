// This contains code used throughout the files.

function createHandleInputChangeFunction(setStateFunction) {
  return function handleInputChange(event) {
    setStateFunction((currentFormData) => {
      const currentFormDataCopy = { ...currentFormData };
      currentFormDataCopy[event.target.name] = event.target.value;
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
    return { status: 503 };
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
    return { status: 503 };
  }
}

async function isAuthenticated() {
  const response = await getRequest(
    import.meta.env.VITE_SERVER_ADDRESS + '/session',
    undefined,
    true,
  );
  if (response.status === 200) {
    return await response.json();
  }
  return false;
}

export {
  createHandleInputChangeFunction,
  getRequest,
  postRequest,
  isAuthenticated,
};
