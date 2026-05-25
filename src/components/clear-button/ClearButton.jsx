// This is a component for a clear button.

import styles from './ClearButton.module.css';

export default function ClearButton({ onClick, styleClass }) {
  /*
  onClick required function
  styleClass optional string (CSS class)
  */
  return (
    <button
      type='button'
      className={`ClearButton ${styles.ClearButton}${styleClass ? ' ' + styleClass : ''}`}
      onClick={onClick}
    >
      x
    </button>
  );
}
