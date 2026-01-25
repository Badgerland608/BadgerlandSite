import { useState } from 'react';
import Header from './Header';

import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Rates from './Rates';
import ScheduleModal from './ScheduleModal';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Header setShowModal={setShowModal} />

      {/* Simple membership bar */}
      <div className="w-full bg-slate-900 text-white flex justify-center gap-4 py-2 text-sm">
        <span>Become a Badgerland Member for faster scheduling.</span>
        <button
          onClick={() => setShowSignup(true)}
          className="underline font-semibold"
        >
          Sign Up
        </button>
        <button
          onClick={() => setShowLogin(true)}
          className="underline"
        >
          Log In
        </button>
      </div>

      <Hero />
      <HowItWorks />
      <Rates />

      <div className="bg-slate-900 text-white text-center py-4">
        <h2>Badgerland Laundry</h2>
      </div>

      {showModal && <ScheduleModal setShowModal={setShowModal} />}
      {showSignup && <SignupModal setShowSignup={setShowSignup} />}
      {showLogin && <LoginModal setShowLogin={setShowLogin} />}
    </>
  );
}

export default App;
