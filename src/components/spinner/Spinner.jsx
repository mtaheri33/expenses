// This is a component for a spinning animation.

import styles from './Spinner.module.css';

export default function Spinner({ styleClass, displayBlock }) {
  /*
  styleClass required string (CSS class) {
    width required
    border-width required
    color required
  }
  displayBlock optional boolean
  */
  return (
    <span
      className={
        `Spinner ${styles.Spinner} ${styleClass} `
        + `${displayBlock ? styles.displayBlock : styles.displayInlineBlock}`
      }
    ></span>
  );
}
