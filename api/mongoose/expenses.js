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
expenseSchema.methods.valid = function () {
  const keys = Object.keys(this.toObject());
  return (
    keys.includes('date')
    && keys.includes('description')
    && keys.includes('amount')
    && keys.includes('categories')
    && keys.includes('user')
  );
};
const Expense = mongoose.model('Expense', expenseSchema);

function create(date, description, amount, categories, userId) {
  /*
  date should be a string in the format YYYY-MM-DD.  For single digit months or days, it should
  start with 0.
  */
  return new Expense({ date, description, amount, categories, user: userId });
}

async function createWithSave(date, description, amount, categories, userId) {
  const expense = create(date, description, amount, categories, userId);
  return await expense.save();
}

function createWithoutSave(date, description, amount, categories, userId) {
  return create(date, description, amount, categories, userId);
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

async function update(id, update) {
  return await Expense.findByIdAndUpdate(id, update, { new: true });
};

async function deleteExpense(id) {
  return await Expense.findByIdAndDelete(id);
};

export default {
  createWithSave,
  createWithoutSave,
  readByUser,
  readById,
  expenseBelongsToUser,
  update,
  deleteExpense,
};
