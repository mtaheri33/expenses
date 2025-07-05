// This handles requests for the /signin resource.

import express from 'express';
import users from '../mongoose/users.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await users.signIn(email, password);
    if (user) {
      req.session.userId = user.id;
      return res.status(200).send();
    }
    return res.status(401).send();
  } catch (error) {
    next(error);
  }
});

export default router;
