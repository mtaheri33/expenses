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
    const expense = await expenses.createWithSave(
      date,
      checkStringInput(description),
      checkAmountInput(amount),
      checkCategoriesInput(categories),
      req.user._id
    );
    return res.status(201).json(expense.convertToJSONObject());
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const userExpenses = await expenses.readByUser(req.user);
    return res.status(200).json(userExpenses.map((expense) => expense.convertToJSONObject()));
  } catch (error) {
    next(error);
  }
});

router.get('/:expenseId', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const expense = await expenses.readById(req.params.expenseId)
    if (!expense || !expenses.expenseBelongsToUser(expense, req.user)) {
      return res.status(404).send();
    }
    return res.status(200).json(expense.convertToJSONObject());
  } catch (error) {
    next(error);
  }
});

router.patch('/:expenseId', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const expense = await expenses.readById(req.params.expenseId)
    if (!expense || !expenses.expenseBelongsToUser(expense, req.user)) {
      return res.status(404).send();
    }
    const { date, description, amount, categories } = req.body;
    const updatedExpense = await expenses.update(expense._id, {
      date,
      description: checkStringInput(description),
      amount: checkAmountInput(amount),
      categories: checkCategoriesInput(categories),
    });
    return res.status(200).json(updatedExpense.convertToJSONObject());
  } catch (error) {
    next(error);
  }
});

router.delete('/:expenseId', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const expense = await expenses.readById(req.params.expenseId)
    if (!expense || !expenses.expenseBelongsToUser(expense, req.user)) {
      return res.status(404).send();
    }
    await expenses.deleteExpense(expense._id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
