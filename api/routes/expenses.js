// This handles requests for the /api/expenses resource.

import express from 'express';
import expenses from '../mongoose/expenses.js';
import { checkStringInput, checkAmountInput, checkCategoriesInput } from '../../utilities.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const { date, description, amount, categories } = req.body;
    await expenses.create(
      date,
      checkStringInput(description),
      checkAmountInput(amount),
      checkCategoriesInput(categories),
      req.user._id
    );
    return res.status(201).send();
  } catch (error) {
    next(error);
  }
});

export default router;
