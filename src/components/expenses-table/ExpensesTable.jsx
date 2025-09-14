// This is a component for an expenses table.

import { SortOrder, SortOrderCharacter } from '../../../constants';
import styles from './ExpensesTable.module.css';
import { useState } from 'react';
import { Link } from 'react-router';
import { formatDateForDisplay, formatAmountForDisplay } from '../../../utilities';

export default function ExpensesTable({ expenses, deleteExpenseFunction, sortExpensesFunction }) {
  /*
  expenses required array [object {
    id required string,
    date required (nullable) string,
    description required string,
    amount required (nullable) number,
    categories required array [string],
  }]
  deleteExpenseFunction required function(string)
  sortExpensesFunction required function(string, SortOrder constant)
  */
  const [dateSortOrder, setDateSortOrder] = useState('');
  const [descriptionSortOrder, setDescriptionSortOrder] = useState('');
  const [amountSortOrder, setAmountSortOrder] = useState('');

  function sortByDate() {
    if (dateSortOrder === '' || dateSortOrder === SortOrder.DESC) {
      sortExpensesFunction('date', SortOrder.ASC);
      setDateSortOrder(SortOrder.ASC);
    } else {
      sortExpensesFunction('date', SortOrder.DESC);
      setDateSortOrder(SortOrder.DESC);
    }
    setDescriptionSortOrder('');
    setAmountSortOrder('');
  }

  function sortByDescription() {
    if (descriptionSortOrder === '' || descriptionSortOrder === SortOrder.DESC) {
      sortExpensesFunction('description', SortOrder.ASC);
      setDescriptionSortOrder(SortOrder.ASC);
    } else {
      sortExpensesFunction('description', SortOrder.DESC);
      setDescriptionSortOrder(SortOrder.DESC);
    }
    setDateSortOrder('');
    setAmountSortOrder('');
  }

  function sortByAmount() {
    if (amountSortOrder === '' || amountSortOrder === SortOrder.DESC) {
      sortExpensesFunction('amount', SortOrder.ASC);
      setAmountSortOrder(SortOrder.ASC);
    } else {
      sortExpensesFunction('amount', SortOrder.DESC);
      setAmountSortOrder(SortOrder.DESC);
    }
    setDateSortOrder('');
    setDescriptionSortOrder('');
  }

  return (
    <table className={`ExpensesTable ${styles.ExpensesTable}`}>
      <thead>
        <tr>
          <th className={`${styles.th} ${styles.thSortable}`} onClick={sortByDate}>
            Date
            {dateSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : null}
            {dateSortOrder === SortOrder.DESC ? SortOrderCharacter.DESC : null}
          </th>
          <th className={`${styles.th} ${styles.thSortable}`} onClick={sortByDescription}>
            Description
            {descriptionSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : null}
            {descriptionSortOrder === SortOrder.DESC ? SortOrderCharacter.DESC : null}
          </th>
          <th className={`${styles.th} ${styles.thSortable}`} onClick={sortByAmount}>
            Amount
            {amountSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : null}
            {amountSortOrder === SortOrder.DESC ? SortOrderCharacter.DESC : null}
          </th>
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
