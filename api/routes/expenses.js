// This handles requests for the /api/expenses resource.

import express from 'express';
import expenses from '../mongoose/expenses.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const { date, description, amount, categories } = req.body;
    await expenses.create(date, description, amount, categories, req.user);
    return res.status(201).send();
  } catch (error) {
    next(error);
  }
});

export default router;
