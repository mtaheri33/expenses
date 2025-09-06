// This is an expenses table component for the expenses page.

import styles from './ExpensesTable.module.css';
import { Link } from 'react-router';
import { formatDateForDisplay, formatAmountForDisplay } from '../../../../utilities';

export default function ExpensesTable({ expenses, deleteExpenseFunction }) {
  /*
  expenses required array [object {
    id required string,
    date required (nullable) string,
    description required string,
    amount required (nullable) number,
    categories required array [string],
  }]
  deleteExpenseFunction required function(string)
  */
  return (
    <table className={`ExpensesTable ${styles.ExpensesTable}`}>
      <thead>
        <tr>
          <th className={styles.th}>Date</th>
          <th className={styles.th}>Description</th>
          <th className={styles.th}>Amount</th>
          <th className={styles.th}>Categories</th>
          <th className={styles.th}></th>
          <th className={styles.th}></th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => {
          return (
            <tr key={expense.id} className={styles.tbodyTr}>
              <td className={styles.td}>{formatDateForDisplay(expense.date)}</td>
              <td className={styles.td}>
                <span title={expense.description}>{expense.description}</span>
              </td>
              <td className={styles.td}>
                <span title={formatAmountForDisplay(expense.amount)}>
                  {formatAmountForDisplay(expense.amount)}
                </span>
              </td>
              <td className={styles.td}>
                <span title={expense.categories.join(' | ')}>
                  {expense.categories.join(' | ')}
                </span>
              </td>
              <td className={styles.tdButton}>
                <Link to={`/expenses/${expense.id}`} className={styles.editLink}>Edit</Link>
              </td>
              <td className={styles.tdButton}>
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteExpenseFunction(expense.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
