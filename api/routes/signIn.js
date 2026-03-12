// This handles requests for the /api/sign-in resource.

import express from 'express';
import users from '../mongoose/users.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const user = await users.signIn(req.body.email, req.body.password);
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
