// This is an expenses table component for the expenses page.

import styles from './ExpensesTable.module.css';
import { formatDateForDisplay, formatAmountForDisplay } from '../../../../utilities';

export default function ExpensesTable({ expenses }) {
  /*
  expenses required array [object {
    id required string,
    date required (nullable) string,
    description required string,
    amount required (nullable) number,
    categories required array [string],
  }]
  */
  return (
    <table className={`ExpensesTable ${styles.ExpensesTable}`}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Categories</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => {
          return (
            <tr key={expense.id}>
              <td>{formatDateForDisplay(expense.date)}</td>
              <td title={expense.description}>{expense.description}</td>
              <td title={formatAmountForDisplay(expense.amount)}>{formatAmountForDisplay(expense.amount)}</td>
              <td title={expense.categories.join(' | ')}>{expense.categories.join(' | ')}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
