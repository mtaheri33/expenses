// This handles requests for the /api/expenses resource.

import express from 'express';
import { requireUser, requireExpense } from '../middleware.js';
import expenses from '../mongoose/expenses.js';
import {
  checkStringInput,
  checkAmountInput,
  checkCategoriesInput,
  checkCategoriesReqQuery,
} from '../../utilities.js';

const router = express.Router();

router.post('/', requireUser, async (req, res, next) => {
  try {
    const expense = await expenses.createWithSave(
      req.body.date,
      checkStringInput(req.body.description),
      checkAmountInput(req.body.amount),
      checkCategoriesInput(req.body.categories),
      req.user._id,
    );
    return res.status(201).json(expense.objectForJson());
  } catch (error) {
    next(error);
  }
});

router.get('/', requireUser, async (req, res, next) => {
  try {
    const results = await expenses.readByUser(
      req.user._id,
      req.query.sortProperty,
      req.query.sortOrder,
      req.query.lastExpenseId === 'null' ? null : req.query.lastExpenseId,
      req.query.fromDate,
      req.query.toDate,
      checkStringInput(req.query.description),
      checkAmountInput(req.query.fromAmount),
      checkAmountInput(req.query.toAmount),
      req.query.categoryType,
      checkCategoriesReqQuery(req.query.categories),
      100,
    );
    return res.status(200).json({
      pageExpenses: results.pageExpenses.map((expense) => expense.objectForJson()),
      hasMore: results.hasMore,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/categories', requireUser, async (req, res, next) => {
  try {
    const categories = await expenses.categories(req.user._id);
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

router.get('/:expenseId', requireUser, requireExpense, async (req, res, next) => {
  try {
    return res.status(200).json(req.expense.objectForJson());
  } catch (error) {
    next(error);
  }
});

router.patch('/:expenseId', requireUser, requireExpense, async (req, res, next) => {
  try {
    const updatedExpense = await expenses.update(req.expense._id, {
      date: req.body.date,
      description: checkStringInput(req.body.description),
      amount: checkAmountInput(req.body.amount),
      categories: checkCategoriesInput(req.body.categories),
    });
    return res.status(200).json(updatedExpense.objectForJson());
  } catch (error) {
    next(error);
  }
});

router.delete('/:expenseId', requireUser, requireExpense, async (req, res, next) => {
  try {
    await expenses.deleteExpense(req.expense._id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
