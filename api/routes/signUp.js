// This handles requests for the /signup resource.

import express from 'express';
import users from '../mongoose/users.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await users.create(email, password);
    if (user) {
      return res.status(201).send();
    }
    return res.status(409).send();
  } catch (error) {
    next(error);
  }
});

export default router;
