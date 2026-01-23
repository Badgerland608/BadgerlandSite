import { useState } from 'react';
import Header from './Header';

import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Rates from './Rates';
import ScheduleModal from './ScheduleModal';

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header setShowModal={setShowModal} />
      <Hero />
      <HowItWorks />
      <Rates />

      <div className="bg-slate-900">
        <h2>Badgerland Laundry</h2>
      </div>

      {showModal && <ScheduleModal setShowModal={setShowModal} />}
    </>
  );
}

export default App;
