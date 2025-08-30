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
const Expense = mongoose.model('Expense', expenseSchema);

async function create(date, description, amount, categories, userId) {
  /*
  date should be a string in the format YYYY-MM-DD.  For single digit months or days, it should
  start with 0.
  */
  const expense = new Expense({ date, description, amount, categories, user: userId });
  return await expense.save();
}

export default {
  create,
};
