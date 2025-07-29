// This is a component for a home page.

import HomeGrid from './components/HomeGrid';
import Navbar from '../../../../components/navbar/Navbar';

export default function Home() {
  return (
    <div className='Home'>
      <Navbar />
      <main>
        <HomeGrid />
      </main>
    </div>
  );
}
