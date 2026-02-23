import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link
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
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    };

    loadInitialSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        const authUser = session?.user ?? null;
        setUser(authUser);
        setLoadingUser(false);

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
          if (mounted) setIsAdmin(false);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
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

  // Close account panel when navigating
  useEffect(() => {
    setShowAccount(false);
  }, [location.pathname]);

  // Close account/admin panels when user logs out
  useEffect(() => {
    if (!user) {
      setShowAccount(false);
      setShowAdmin(false);
    }
  }, [user]);

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
            <Route path="/" element={<HomeView />} />
            <Route path="/plans" element={<Plans user={user} />} />
            
            {/* Success and Cancel routes for Stripe Redirect */}
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<Plans user={user} />} />

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

      {showAccount && user && (
        <MyAccount user={user} setShowAccount={setShowAccount} />
      )}
    </div>
  );
}

/* ===========================
SUB-VIEWS FOR CLEAN ROUTING
=========================== */

function HomeView() {
  return (
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
        <Link
          to="/plans"
          className="bg-purple-700 text-white px-6 py-3 rounded-full font-semibold inline-block"
        >
          View Subscription Plans
        </Link>
      </div>

      <ServiceArea />
      <WhyChooseUs />
      <FAQ />
      <FinalCTA />
    </>
  );
}

function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-purple-900 mb-4">Subscription Confirmed!</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Welcome to Badgerland Laundry! Your account has been updated and your subscription is now active.
      </p>
      <Link 
        to="/" 
        className="bg-purple-700 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-800 transition shadow-lg"
      >
        Go to Home
      </Link>
    </div>
  );
}