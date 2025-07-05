// This is a component for a home page.

import Navbar from '../../../../components/navbar/Navbar';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className='Home'>
      <Navbar />
      <main>
        <div>Home Page</div>
      </main>
    </div>
  );
}
