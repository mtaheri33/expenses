// This is a grid component for the home page.

import styles from './HomeGrid.module.css';
import { Link } from 'react-router';

export default function HomeGrid() {
  return (
    <div className={'HomeGrid ' + styles.grid}>
      <div className={styles.row}>
        <Link to='/expenses' className={styles.col}>Expenses</Link>
        <Link className={styles.col}>Sign Out</Link>
      </div>
    </div>
  );
}
