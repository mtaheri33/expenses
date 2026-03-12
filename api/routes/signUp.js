// This handles requests for the /api/sign-up resource.

import express from 'express';
import users from '../mongoose/users.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const user = await users.create(req.body.email, req.body.password);
    if (user) {
      return res.status(201).send();
    }
    return res.status(409).send();
  } catch (error) {
    next(error);
  }
});

export default router;
