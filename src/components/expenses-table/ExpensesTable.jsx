// This is a component for an expenses table.

import { ExpenseSortProperty, SortOrder, SortOrderCharacter } from '../../../constants';
import styles from './ExpensesTable.module.css';
import { Link } from 'react-router';
import { formatDateForDisplay, formatAmountForDisplay } from '../../../utilities';

export default function ExpensesTable({
  expenses,
  showButtons,
  deleteExpenseFunction,
  sortExpensesFunction,
  tableSortProperty,
  tableSortOrder,
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
  sortExpensesFunction optional function(ExpenseSortProperty constant, SortOrder constant)
  tableSortProperty required if sortExpensesFunction is given ExpenseSortProperty constant
  tableSortOrder required if sortExpensesFunction is given SortOrder constant
  */
  const expensesTotal = expenses.reduce((sum, expense) => {
    return sum + (expense.amount !== null ? expense.amount : 0)
  }, 0);

  function sortExpenses(sortProperty) {
    let sortOrder;
    if (sortProperty === tableSortProperty && tableSortOrder === SortOrder.DESC) {
      sortOrder = SortOrder.ASC;
    } else {
      sortOrder = SortOrder.DESC;
    }
    sortExpensesFunction(sortProperty, sortOrder);
  }

  function sortByDate() {
    sortExpenses(ExpenseSortProperty.DATE);
  }

  function sortByDescription() {
    sortExpenses(ExpenseSortProperty.DESCRIPTION);
  }

  function sortByAmount() {
    sortExpenses(ExpenseSortProperty.AMOUNT);
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
            {sortExpensesFunction && tableSortProperty === ExpenseSortProperty.DATE ?
              tableSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : SortOrderCharacter.DESC
              : null
            }
          </th>
          <th
            className={
              `${styles.th} ${styles.descriptionCol}`
              + `${sortExpensesFunction ? ' ' + styles.thSortable : ''}`
            }
            onClick={sortExpensesFunction ? sortByDescription : undefined}
          >
            Description
            {sortExpensesFunction && tableSortProperty === ExpenseSortProperty.DESCRIPTION ?
              tableSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : SortOrderCharacter.DESC
              : null
            }
          </th>
          <th
            className={
              `${styles.th} ${styles.amountCol}`
              + `${sortExpensesFunction ? ' ' + styles.thSortable : ''}`
            }
            onClick={sortExpensesFunction ? sortByAmount : undefined}
          >
            Amount
            {sortExpensesFunction && tableSortProperty === ExpenseSortProperty.AMOUNT ?
              tableSortOrder === SortOrder.ASC ? SortOrderCharacter.ASC : SortOrderCharacter.DESC
              : null
            }
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
      <tfoot>
        <tr>
          <td className={`${styles.tfootTd} ${styles.dateCol}`}></td>
          <td className={`${styles.tfootTd} ${styles.descriptionCol}`}>Total</td>
          <td className={`${styles.tfootTd} ${styles.amountCol}`}>
            <span title={formatAmountForDisplay(expensesTotal)}>
              {formatAmountForDisplay(expensesTotal)}
            </span>
          </td>
          <td
            className={
              `${styles.tfootTd} `
              + `${showButtons ? styles.categoriesColNarrower : styles.categoriesColWider}`
            }
          ></td>
          {showButtons ? <td className={`${styles.tfootTd} ${styles.buttonCol}`}></td> : null}
          {showButtons ? <td className={`${styles.tfootTd} ${styles.buttonCol}`}></td> : null}
        </tr>
      </tfoot>
    </table>
  );
}
