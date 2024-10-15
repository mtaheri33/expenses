// This is the main handler for requests to the server.

import express from 'express';
const app = express();

app.use((req, res) => {
  console.log(`Received a ${req.method} request`);
  res.send('Here is a response');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
