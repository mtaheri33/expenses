// This is a component for a page header.

import styles from './ExpensesHeader.module.css';

export default function ExpensesHeader({ styleClass }) {
  /*
  styleClass required string (CSS class) {
    Width to font-size ratio should be 5 to 1
    width required
    font-size required
  }
  */
  return (
    <h1 className={`ExpensesHeader ${styles.ExpensesHeader} ${styleClass}`}>Expenses</h1>
  );
}
