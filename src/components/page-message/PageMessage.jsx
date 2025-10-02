// This is a component for a message on a page.

import { PageMessageType } from '../../../constants';
import styles from './PageMessage.module.css';
import { useState, useEffect } from 'react';

export default function PageMessage({ type, message, displayTime }) {
  /*
  type required PageMessageType constant
  message required HTML element (message cannot be a string, because if the same message is passed
    to this component multiple times in a row, it will only show once and then React will not
    rerender the page to display it again.)
  displayTime required number (milliseconds)
  */
  const [displayMessage, setDisplayMessage] = useState(false);

  useEffect(() => {
    if (!message) {
      return;
    }
    setDisplayMessage(true);
    const timer = setTimeout(() => {
      setDisplayMessage(false);
    }, displayTime);
    // This cancels the timeout if useEffect runs again while the timeout is running or the user
    // navigates away from the page.  If those scenarios happen and the timeout is not cancelled,
    // it will cause issues.
    return () => {
      setDisplayMessage(false);
      clearTimeout(timer);
    };
  }, [message]);

  function closeMessage() {
    setDisplayMessage(false);
  }

  if (!displayMessage) {
    return;
  }
  let typeStyle;
  switch (type) {
    case PageMessageType.SUCCESS:
      typeStyle = styles.success;
      break;
    case PageMessageType.FAILURE:
      typeStyle = styles.failure;
      break;
  }
  return (
    <div className={`PageMessage ${styles.PageMessage} ${typeStyle}`}>
      {message}
      <button className={styles.closeButton} onClick={closeMessage}>x</button>
    </div>
  );
}
