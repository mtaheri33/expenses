// This handles requests for the /api/expenses resource.

import express from 'express';
import { requireUser } from '../middleware.js';
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

async function getExpenseById(expenseId, user) {
  const expense = await expenses.readById(expenseId);
  if (!expense || !expenses.expenseBelongsToUser(expense, user)) {
    return null;
  }
  return expense;
}

router.get('/:expenseId', requireUser, async (req, res, next) => {
  try {
    const expense = await getExpenseById(req.params.expenseId, req.user);
    if (!expense) {
      return res.status(404).send();
    }
    return res.status(200).json(expense.objectForJson());
  } catch (error) {
    next(error);
  }
});

router.patch('/:expenseId', requireUser, async (req, res, next) => {
  try {
    const expense = await getExpenseById(req.params.expenseId, req.user);
    if (!expense) {
      return res.status(404).send();
    }
    const updatedExpense = await expenses.update(expense._id, {
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

router.delete('/:expenseId', requireUser, async (req, res, next) => {
  try {
    const expense = await getExpenseById(req.params.expenseId, req.user);
    if (!expense) {
      return res.status(404).send();
    }
    await expenses.deleteExpense(expense._id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
