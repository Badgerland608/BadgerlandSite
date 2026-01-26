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
import { supabase } from './lib/supabaseClient';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
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

  return (
    <div className="relative z-0">
      <Header
        setShowModal={setShowModal}
        user={user}
        setShowAccount={setShowAccount}
      />

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
