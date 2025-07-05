// This is a component for a page loading animation.

import styles from './PageLoading.module.css';
import Spinner from '../spinner/Spinner';

export default function PageLoading() {
  return <div className='PageLoading'><Spinner styleClass={styles.spinner} /></div>;
}
