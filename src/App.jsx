// cloudflare rebuild 5

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import Plans from "./Plans";

import About from "./About";
import Residential from "./Residential";
import Commercial from "./Commercial";

import { supabase } from './lib/supabaseClient';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Load session + profile
  useEffect(() => {
    const loadUserAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', authUser.id)
            .maybeSingle();

          if (error && error.code !== "PGRST116") throw error;

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

    // Auth listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', authUser.id)
            .maybeSingle();

          setIsAdmin(profile?.is_admin === true);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loadingUser) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="p-10 text-center text-red-600">
        Error loading profile: {profileError}
      </div>
    );
  }

  // Admin view
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

  return (
    <Router>
      <div className="relative z-0">
        <Header
          setShowModal={setShowModal}
          user={user}
          isAdmin={isAdmin}
          setShowAdmin={setShowAdmin}
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
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

                <div className="text-center my-10 px-4">
                  <h2 className="text-2xl font-bold text-purple-800 mb-2">
                    Want to save money on every pickup?
                  </h2>
                  <p className="text-purple-700 mb-4">
                    Become a member and enjoy included pounds, discounted rates, and priority service.
                  </p>
                  <a
                    href="/plans"
                    className="bg-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-purple-600 transition"
                  >
                    View Subscription Plans
                  </a>
                </div>

                <ServiceArea />
                <WhyChooseUs />
                <FAQ />
                <FinalCTA />
              </>
            }
          />

          <Route path="/About" element={<About />} />
          <Route path="/Residential" element={<Residential />} />
          <Route path="/Commercial" element={<Commercial />} />

          <Route path="/plans" element={<Plans user={user} />} />

          <Route
            path="/my-account"
            element={<MyAccount user={user} />}
          />
        </Routes>

        <div className="bg-purple-900 text-white text-center py-3">
          <h2>Badgerland Laundry LLC</h2>
        </div>

        {showModal && (
          <ScheduleModal setShowModal={setShowModal} user={user} />
        )}
      </div>
    </Router>
  );
}

export default App;