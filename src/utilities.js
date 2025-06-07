// This contains code used throughout the files.

async function postRequest(url, body, headers) {
  try {
    return await fetch(url, {
      method: 'POST',
      body,
      headers,
    });
  } catch {
    return { status: 503 };
  }
}

export {
  postRequest,
};
