// This is for the expenses MongoDB collection.

import { ExpenseSortProperty, SortOrder } from '../../constants.js';
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
// This creates compound indexes.  It first finds expenses belonging to the specified user.  The
// sign can be positive or negative.  It then orders the expenses by property descending, since the
// sign is negative.  In the query it can still order them by property ascending by using 1 in the
// sort, but since descending order is the default then in this definition use negative.  Finally,
// if expenses have the same value for the property it orders them by id.  The sign should match
// the sign for the property.
expenseSchema.index({ user: 1, date: -1, _id: -1 });
expenseSchema.index(
  { user: 1, description: -1, _id: -1 },
  // This compares descriptions case-insensitive.
  { collation: { locale: 'en', strength: 2 } },
);
expenseSchema.index({ user: 1, amount: -1, _id: -1 });
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

async function readByUser(userId, sortProperty, sortOrder, lastExpenseId, limit) {
  const filter = { user: userId };
  const dir = sortOrder === SortOrder.ASC ? 1 : -1;
  const sort = { [sortProperty]: dir, _id: dir };
  const cmp = dir === 1 ? '$gt' : '$lt';
  if (lastExpenseId && mongoose.Types.ObjectId.isValid(lastExpenseId)) {
    const anchor = await Expense.findOne({ _id: lastExpenseId, user: userId })
      .select({ [sortProperty]: 1, _id: 1 });
    if (anchor) {
      const anchorPropertyValue = anchor[sortProperty];
      const anchorId = anchor._id;
      // This makes the query get all expenses that come after the anchor (given last expense).
      // The first or condition gets expenses with property values greater/less than the anchor's
      // property value.  The second or condition gets expenses with property values equal to the
      // anchor's property value.  For these expenses, it uses the ids to determine which ones come
      // after the anchor.
      filter.$or = [
        { [sortProperty]: { [cmp]: anchorPropertyValue } },
        { [sortProperty]: anchorPropertyValue, _id: { [cmp]: anchorId } },
      ];
    }
  }

  const query = Expense.find(filter);
  if (sortProperty === ExpenseSortProperty.DESCRIPTION) {
    query.collation({ locale: 'en', strength: 2 });
  }
  const pageExpensesPlusNext = await query.sort(sort).limit(limit + 1);
  const hasMore = pageExpensesPlusNext.length > limit;
  const pageExpenses = hasMore ? pageExpensesPlusNext.slice(0, limit) : pageExpensesPlusNext;
  return { pageExpenses, hasMore };
}

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
  readById,
  readByUser,
  expenseBelongsToUser,
  update,
  deleteExpense,
};
