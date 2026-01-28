// cloudflare rebuild 4

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
import AdminDashboard from './AdminDashboard';

import { supabase } from './lib/supabaseClient';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Load session + profile
  useEffect(() => {
    const loadUserAndProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', authUser.id)
            .single();

          if (error) throw error;

          setIsAdmin(profile?.is_admin === true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setProfileError(err.message);
      }

      setLoadingUser(false);
    };

    loadUserAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', authUser.id)
            .single();

          setIsAdmin(profile?.is_admin === true);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Loading state prevents flicker
  if (loadingUser) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="p-10 text-center text-red-600">
        Error loading profile: {profileError}
      </div>
    );
  }

  // Admin view (protected)
  if (showAdmin) {
    if (!isAdmin) {
      return (
        <div className="p-6 text-red-600 text-center">
          Not authorized.
        </div>
      );
    }

    return (
      <div className="relative z-0">
        <Header
          setShowModal={setShowModal}
          user={user}
          setShowAccount={setShowAccount}
          isAdmin={isAdmin}
          setShowAdmin={setShowAdmin}
        />

        <div className="p-4">
          <button
            onClick={() => setShowAdmin(false)}
            className="px-3 py-1 rounded bg-purple-700 text-white text-sm"
          >
            Back to site
          </button>
        </div>

        <AdminDashboard user={user} />
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
        isAdmin={isAdmin}
        setShowAdmin={setShowAdmin}
      />

      {/* Admin button — only visible to admins */}
      {user && isAdmin && (
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

      {showModal && (
        <ScheduleModal setShowModal={setShowModal} user={user} />
      )}

      {showAccount && user && (
        <MyAccount user={user} setShowAccount={setShowAccount} />
      )}
    </div>
  );
}

export default App;