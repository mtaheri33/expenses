// This contains middleware functions used throughout the server files.

import expenses from './mongoose/expenses.js';

function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).send();
  }
  next();
}

async function getExpense(id, user) {
  const expense = await expenses.readById(id);
  if (!expense || !expenses.expenseBelongsToUser(expense, user)) {
    return null;
  }
  return expense;
}

async function requireExpense(req, res, next) {
  const expense = await getExpense(req.params.expenseId, req.user);
  if (!expense) {
    return res.status(404).send();
  }
  req.expense = expense;
  next();
}

export {
  requireUser,
  requireExpense,
};
