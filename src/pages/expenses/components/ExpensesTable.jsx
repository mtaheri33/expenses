// This is an expenses table component for the expenses page.

import styles from './ExpensesTable.module.css';

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
    <div className='ExpensesTable'>
      <table>
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
                <td>{expense.date}</td>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>
                <td>{expense.categories}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
