// This is a component for a spinning animation.

import styles from './Spinner.module.css';

export default function Spinner({ styleClass }) {
  /*
  styleClass required string (CSS class) {
    width required
    border-width required
    color required
  }
  */
  return <span className={`Spinner ${styles.Spinner} ${styleClass}`}></span>;
}
