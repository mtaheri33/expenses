// This handles requests for the /api/charts resource.

import express from 'express';
import { requireUser } from '../middleware.js';
import expenses from '../mongoose/expenses.js';

const router = express.Router();

router.get('/', requireUser, async (req, res, next) => {
  try {
    const results = await expenses.readAllByUser(req.user._id);
    return res.status(200).json(results.map((expense) => expense.objectForJson()));
  } catch (error) {
    next(error);
  }
});

export default router;
