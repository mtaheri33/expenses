// This handles requests for the /api/session resource.

import express from 'express';
import { requireUser } from '../middleware.js';

const router = express.Router();

router.get('/', requireUser, async (req, res, next) => {
  try {
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default router;
