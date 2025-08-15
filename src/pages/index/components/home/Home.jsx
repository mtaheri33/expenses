// This is a component for a home page.

import HomeGrid from './components/HomeGrid';
import Navbar from '../../../../components/navbar/Navbar';
import PageMessage from '../../../../components/page-message/PageMessage';
import { useState } from 'react';

export default function Home() {
  const [pageMessageProperties, setPageMessageProperties] = useState({});

  return (
    <div className='Home'>
      <Navbar />
      <main>
        <PageMessage
          type={pageMessageProperties.type}
          message={pageMessageProperties.message}
          displayTime={pageMessageProperties.displayTime}
        />
        <HomeGrid setPageMessageProperties={setPageMessageProperties} />
      </main>
    </div>
  );
}
