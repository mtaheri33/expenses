// This is a component for a navigation bar.

import styles from './Navbar.module.css';
import { Link } from 'react-router';

export default function Navbar() {
  return (
    <nav className={'Navbar ' + styles.nav}>
      <ul className={styles.ul}>
        <li><Link to='/' className={styles.navLink}>Home</Link></li>
        <li><Link to='/expenses' className={styles.navLink}>Expenses</Link></li>
      </ul>
    </nav>
  );
}
