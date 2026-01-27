// cloudflare rebuild 3

import { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import Intro from './Intro';
import HowItWorks from './HowItWorks';
import Rates from './Rates';
import ServiceArea from './ServiceArea';
import WhyChooseUs from './WhyChooseUs';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';
import ScheduleModal from './ScheduleModal';
import MyAccount from './MyAccount';
import AdminDashboard from './AdminDashboard'; // 👈 add this
import { supabase } from './lib/supabaseClient';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false); // 👈 add this
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // If admin view is open, show only the dashboard
  if (showAdmin) {
    return (
      <div className="relative z-0">
        <Header
          setShowModal={setShowModal}
          user={user}
          setShowAccount={setShowAccount}
        />

        {/* Simple back button */}
        <div className="p-4">
          <button
            onClick={() => setShowAdmin(false)}
            className="px-3 py-1 rounded bg-purple-700 text-white text-sm"
          >
            Back to site
          </button>
        </div>

        <AdminDashboard />
      </div>
    );
  }

  // Normal site view
  return (
    <div className="relative z-0">
      <Header
        setShowModal={setShowModal}
        user={user}
        setShowAccount={setShowAccount}
      />

      {/* Temporary admin button – only shows when logged in */}
      {user && (
        <div className="p-4">
          <button
            onClick={() => setShowAdmin(true)}
            className="px-3 py-1 rounded bg-purple-700 text-white text-sm"
          >
            Open Admin Dashboard
          </button>
        </div>
      )}

      <Hero />
      <Intro />
      <HowItWorks />
      <Rates />
      <ServiceArea />
      <WhyChooseUs />
      <FAQ />
      <FinalCTA />

      <div className="bg-slate-900 text-white text-center py-4">
        <h2>Badgerland Laundry</h2>
      </div>

      {showModal && <ScheduleModal setShowModal={setShowModal} user={user} />}
      {showAccount && user && (
        <MyAccount user={user} setShowAccount={setShowAccount} />
      )}
    </div>
  );
}

export default App;