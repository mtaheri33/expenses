// This is for the expenses MongoDB collection.

import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  date: Date,
  description: String,
  amount: Number,
  categories: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
});
expenseSchema.methods.convertToJSONObject = function () {
  return {
    id: this._id.toString(),
    date: this.date ? this.date.toISOString().split('T')[0] : null,
    description: this.description,
    amount: this.amount,
    categories: this.categories,
  };
};
const Expense = mongoose.model('Expense', expenseSchema);

async function create(date, description, amount, categories, userId) {
  /*
  date should be a string in the format YYYY-MM-DD.  For single digit months or days, it should
  start with 0.
  */
  const expense = new Expense({ date, description, amount, categories, user: userId });
  return await expense.save();
}

async function readByUser(user) {
  return await Expense.find({ user: user._id });
};

async function readById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const expense = await Expense.findById(id);
  if (expense) {
    return expense;
  }
  return null;
};

function expenseBelongsToUser(expense, user) {
  return expense.user.equals(user._id);
}

export default {
  create,
  readByUser,
  readById,
  expenseBelongsToUser,
};
