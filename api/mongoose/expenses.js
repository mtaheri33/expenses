// This is for the expenses MongoDB collection.

import { ExpenseSortProperty, SortOrder, CategoryType } from '../../constants.js';
import mongoose from 'mongoose';
import { escapeRegex } from '../../utilities.js';

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  categories: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
expenseSchema.methods.objectForJson = function () {
  return {
    id: this._id.toString(),
    date: this.date.toISOString().split('T')[0],
    description: this.description,
    amount: this.amount,
    categories: this.categories,
    userId: this.user._id.toString(),
  };
};
expenseSchema.methods.valid = function () {
  return this.validateSync() === undefined;
};
const Expense = mongoose.model('Expense', expenseSchema);

function create(date, description, amount, categories, userId) {
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

async function readByUser(
  userId,
  sortProperty,
  sortOrder,
  lastExpenseId,
  fromDate,
  toDate,
  description,
  fromAmount,
  toAmount,
  categoryType,
  categories,
  limit,
) {
  const filter = { user: userId };
  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) {
      filter.date.$gte = new Date(fromDate + 'T00:00:00.000Z');
    }
    if (toDate) {
      filter.date.$lte = new Date(toDate + 'T23:59:59.999Z');
    }
  }
  if (description) {
    // This filters for expenses with descriptions that contain the given description case
    // insensitive.
    filter.description = { $regex: escapeRegex(description), $options: 'i' };
  }
  if (fromAmount !== null || toAmount !== null) {
    filter.amount = {};
    if (fromAmount !== null) {
      filter.amount.$gte = fromAmount;
    }
    if (toAmount !== null) {
      filter.amount.$lte = toAmount;
    }
  }
  if (categoryType && categories.length > 0) {
    if (categoryType === CategoryType.INCLUDE) {
      // This filters for expenses where the categories array contains at least one category equal
      // to one of the given categories case insensitive.
      filter.categories = {
        $in: categories.map((category) => new RegExp(`^${escapeRegex(category)}$`, 'i')),
      };
    } else if (categoryType === CategoryType.EXCLUDE) {
      // This filters for expenses where the categories array contains none of the given categories
      // case insensitive.
      filter.categories = {
        $nin: categories.map((category) => new RegExp(`^${escapeRegex(category)}$`, 'i')),
      };
    }
  }
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
      // anchor's property value.  For the expenses with equal values, it uses the ids to determine
      // which ones come before/after the anchor.
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

async function categories(userId) {
  const rows = await Expense.aggregate([
    // Get all expenses for the given user.
    { $match: { user: userId } },
    // For each expense, turn it into multiple expense objects for each element in categories, with
    // key categories having a single string value now instead of an array.
    { $unwind: '$categories' },
    // Group objects by the categories string lowercase value.  _id is the lowercase value, and
    // category is the original value of one of the strings in the group.
    { $group: { _id: { $toLower: '$categories' }, category: { $first: '$categories' } } },
    // Sort ascending, which also makes it case insensitive since the _id values are all lowercase.
    { $sort: { _id: 1 } },
    // Remove the _id key value pair from the objects.
    { $project: { _id: 0, category: 1 } },
  ]);
  return rows.map((row) => row.category);
}

export default {
  createWithSave,
  createWithoutSave,
  readById,
  readByUser,
  expenseBelongsToUser,
  update,
  deleteExpense,
  categories,
};
