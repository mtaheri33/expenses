// This handles requests for the /api/expenses resource.

import { ExpenseSortProperty, SortOrder } from '../../constants.js';
import express from 'express';
import { requireUser } from '../middleware.js';
import expenses from '../mongoose/expenses.js';
import {
  checkStringInput,
  checkAmountInput,
  checkCategoriesInput,
  parseCategoriesInput,
} from '../../utilities.js';

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
    return res.status(201).json(expense.objectForJson());
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const sortProperty = (
      Object.values(ExpenseSortProperty).includes(req.query.sortProperty) ?
        req.query.sortProperty : ExpenseSortProperty.DATE
    );
    const sortOrder = (
      Object.values(SortOrder).includes(req.query.sortOrder) ?
        req.query.sortOrder : SortOrder.DESC
    );
    const lastExpenseId = req.query.lastExpenseId === 'null' ? null : req.query.lastExpenseId;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const description = req.query.description;
    const fromAmount = req.query.fromAmount;
    const toAmount = req.query.toAmount;
    const categoryType = req.query.categoryType;
    const categories = req.query.categories;
    const limit = 100;
    const results = await expenses.readByUser(
      req.user._id,
      sortProperty,
      sortOrder,
      lastExpenseId,
      fromDate,
      toDate,
      checkStringInput(description),
      checkAmountInput(fromAmount),
      checkAmountInput(toAmount),
      categoryType,
      parseCategoriesInput(categories),
      limit,
    );
    return res.status(200).json({
      pageExpenses: results.pageExpenses.map((expense) => expense.objectForJson()),
      hasMore: results.hasMore,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const categories = await expenses.categories(req.user._id);
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

router.get('/:expenseId', requireUser, async (req, res, next) => {
  try {
    console.log(typeof req.params.expenseId)
    const expense = await expenses.readById(req.params.expenseId);
    if (!expense || !expenses.expenseBelongsToUser(expense, req.user)) {
      return res.status(404).send();
    }
    return res.status(200).json(expense.objectForJson());
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
    return res.status(200).json(updatedExpense.objectForJson());
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
