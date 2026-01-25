import { useState, useEffect } from 'react';
import Header from './Header';

import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Rates from './Rates';
import ScheduleModal from './ScheduleModal';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import MyAccount from './MyAccount';
import { supabase } from './lib/supabaseClient';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowAccount(false);
  };

  return (
    <>
      <Header setShowModal={setShowModal} />

      {/* Membership bar */}
      <div className="w-full bg-slate-900 text-white flex flex-wrap justify-center gap-4 py-2 text-sm">
        {!user && (
          <>
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
          </>
        )}
        {user && (
          <>
            <span>Welcome back, {user.user_metadata?.full_name || 'Member'}.</span>
            <button
              onClick={() => setShowAccount(true)}
              className="underline font-semibold"
            >
              My Account
            </button>
            <button
              onClick={handleLogout}
              className="underline"
            >
              Log Out
            </button>
          </>
        )}
      </div>

      <Hero />
      <HowItWorks />
      <Rates />

      <div className="bg-slate-900 text-white text-center py-4">
        <h2>Badgerland Laundry</h2>
      </div>

      {showModal && <ScheduleModal setShowModal={setShowModal} user={user} />}
      {showSignup && <SignupModal setShowSignup={setShowSignup} />}
      {showLogin && <LoginModal setShowLogin={setShowLogin} />}
      {showAccount && user && (
        <MyAccount user={user} setShowAccount={setShowAccount} />
      )}
    </>
  );
}

export default App;
