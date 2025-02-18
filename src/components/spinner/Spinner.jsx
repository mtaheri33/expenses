// This is a component for a spinning animation.

import styles from './Spinner.module.css';

export default function Spinner({ styleClass }) {
  // Width to padding ratio in styleClass should be 6.25 to 1.
  return <div
    className={'Spinner ' + styles.Spinner + ' ' + styleClass}
  ></div>;
}
