// This contains constants used throughout the files.

const ExpenseSortProperty = { DATE: 'date', DESCRIPTION: 'description', AMOUNT: 'amount' };

const SortOrder = { ASC: 'ascending', DESC: 'descending' };

const SortOrderCharacter = { ASC: '\u2191', DESC: '\u2193' };

const ImportMode = { PREVIEW: 'preview', SAVE: 'save' };

const CategoryType = { INCLUDE: 'include', EXCLUDE: 'exclude' };

const RequestMethod = { GET: 'get', POST: 'post', PATCH: 'patch', DELETE: 'delete' };

export {
  ExpenseSortProperty,
  SortOrder,
  SortOrderCharacter,
  ImportMode,
  CategoryType,
  RequestMethod,
};
