import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

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


/* ===========================
   ROOT APP — AUTH LIVES HERE
=========================== */

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  async function ensureUserRows(userId) {
    try {
      await supabase.rpc('ensure_profile', { uid: userId });
      await supabase.rpc('ensure_notify_settings', { uid: userId });
    } catch (err) {
      console.error("ensureUserRows error:", err);
    }
  }

  useEffect(() => {
    let mounted = true;

    const loadInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        const authUser = session?.user ?? null;
        setUser(authUser);

        if (!authUser) {
          setIsAdmin(false);
          return;
        }

        await ensureUserRows(authUser.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', authUser.id)
          .maybeSingle();

        if (mounted) {
          setIsAdmin(profile?.is_admin === true);
        }
      } catch (err) {
        console.error('loadInitialSession error:', err);
        if (mounted) {
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoadingUser(false);
        }
      }
    };

    loadInitialSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        const authUser = session?.user ?? null;
        setUser(authUser);

        if (!authUser) {
          setIsAdmin(false);
          return;
        }

        try {
          await ensureUserRows(authUser.id);

          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', authUser.id)
            .maybeSingle();

          if (mounted) {
            setIsAdmin(profile?.is_admin === true);
          }
        } catch (err) {
          console.error('onAuthStateChange profile load error:', err);
          if (mounted) {
            setIsAdmin(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loadingUser) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <Router>
      <AppContent
        user={user}
        isAdmin={isAdmin}
      />
    </Router>
  );
}


/* ===========================
   APP CONTENT — UI ONLY
=========================== */

function AppContent({ user, isAdmin }) {
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    setShowAccount(false);
  }, [location.pathname]);

  return (
    <div className="relative z-0">
      <Header
        setShowModal={setShowModal}
        user={user}
        setShowAccount={setShowAccount}
        isAdmin={isAdmin}
        setShowAdmin={setShowAdmin}
      />

      {showAdmin && isAdmin ? (
        <>
          <div className="p-4">
            <button
              onClick={() => setShowAdmin(false)}
              className="px-3 py-1 rounded bg-purple-700 text-white text-sm"
            >
              Back to site
            </button>
          </div>

          <AdminDashboard user={user} />
        </>
      ) : (
        <>
          <Routes>
            <Route
              path="/"
              element={
                <>
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
                      className="bg-purple-700 text-white px-6 py-3 rounded-full font-semibold"
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

            <Route path="/plans" element={<Plans user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/residential" element={<Residential />} />
            <Route path="/commercial" element={<Commercial />} />
          </Routes>

          <footer className="bg-purple-900 text-white text-center py-3">
            Badgerland Laundry LLC
          </footer>
        </>
      )}

      {showModal && (
        <ScheduleModal setShowModal={setShowModal} user={user} />
      )}

      {showAccount && (
        <MyAccount user={user} setShowAccount={setShowAccount} />
      )}
    </div>
  );
}