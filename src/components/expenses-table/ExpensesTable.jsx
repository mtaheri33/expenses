// This is a component for an expenses table.

import { SortOrder, SortOrderCharacter } from '../../../constants';
import styles from './ExpensesTable.module.css';
import { useState } from 'react';
import { Link } from 'react-router';
import { formatDateForDisplay, formatAmountForDisplay } from '../../../utilities';

export default function ExpensesTable({
  expenses,
  showButtons,
  deleteExpenseFunction,
  sortExpensesFunction,
}) {
  /*
  expenses required array [object {
    id required string,
    date required (nullable) string,
    description required string,
    amount required (nullable) number,
    categories required array [string],
  }]
  showButtons optional boolean
  deleteExpenseFunction required if showButtons is true function(string)
  sortExpensesFunction optional function(string, SortOrder constant)
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
        <tr className={styles.theadTr}>
          <th
            className={
              `${styles.th} ${styles.dateCol}`
              + `${sortExpensesFunction ? ' ' + styles.thSortable : ''}`
            }
            onClick={sortExpensesFunction ? sortByDate : undefined}
          >
            Date
            {dateSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : null}
            {dateSortOrder === SortOrder.DESC ? SortOrderCharacter.DESC : null}
          </th>
          <th
            className={
              `${styles.th} ${styles.descriptionCol}`
              + `${sortExpensesFunction ? ' ' + styles.thSortable : ''}`
            }
            onClick={sortExpensesFunction ? sortByDescription : undefined}
          >
            Description
            {descriptionSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : null}
            {descriptionSortOrder === SortOrder.DESC ? SortOrderCharacter.DESC : null}
          </th>
          <th
            className={
              `${styles.th} ${styles.amountCol}`
              + `${sortExpensesFunction ? ' ' + styles.thSortable : ''}`
            }
            onClick={sortExpensesFunction ? sortByAmount : undefined}
          >
            Amount
            {amountSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : null}
            {amountSortOrder === SortOrder.DESC ? SortOrderCharacter.DESC : null}
          </th>
          <th
            className={
              `${styles.th} `
              + `${showButtons ? styles.categoriesColNarrower : styles.categoriesColWider}`
            }
          >
            Categories
          </th>
          {showButtons ? <th className={`${styles.th} ${styles.buttonCol}`}></th> : null}
          {showButtons ? <th className={`${styles.th} ${styles.buttonCol}`}></th> : null}
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => {
          return (
            <tr key={expense.id} className={styles.tbodyTr}>
              <td className={`${styles.td} ${styles.dateCol}`}>
                {formatDateForDisplay(expense.date)}
              </td>
              <td className={`${styles.td} ${styles.descriptionCol}`}>
                <span title={expense.description}>{expense.description}</span>
              </td>
              <td className={`${styles.td} ${styles.amountCol}`}>
                <span title={formatAmountForDisplay(expense.amount)}>
                  {formatAmountForDisplay(expense.amount)}
                </span>
              </td>
              <td
                className={
                  `${styles.td} `
                  + `${showButtons ? styles.categoriesColNarrower : styles.categoriesColWider}`
                }
              >
                <span title={expense.categories.join(' | ')}>
                  {expense.categories.join(' | ')}
                </span>
              </td>
              {showButtons ?
                <td className={`${styles.td} ${styles.buttonCol}`}>
                  <Link to={`/expenses/${expense.id}`} className={styles.editLink}>Edit</Link>
                </td>
                : null
              }
              {showButtons ?
                <td className={`${styles.td} ${styles.buttonCol}`}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteExpenseFunction(expense.id)}
                  >
                    Delete
                  </button>
                </td>
                : null
              }
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
