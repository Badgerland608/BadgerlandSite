import { useState } from 'react';
import Header from './Header';

import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Rates from './Rates';

function App() {

  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Rates />

      <div className="bg-slate-900">
        <h2>Badgerland Laundry</h2>
      </div>
    </>
  );
}

export default App;
