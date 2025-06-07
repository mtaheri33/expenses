// This is a component for a spinning animation.

import styles from './Spinner.module.css';

export default function Spinner({ styleClass }) {
  /*
  styleClass required string (CSS class) {
    Width to padding ratio should be 6.25 to 1
    width required
    padding required
  }
  */

  return <div className={'Spinner ' + styles.Spinner + ' ' + styleClass}></div>;
}
