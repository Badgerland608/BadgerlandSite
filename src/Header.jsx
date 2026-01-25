import { useState } from 'react';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { supabase } from './lib/supabaseClient';

function Header({ setShowModal, user, setShowAccount }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const openAuth = (newMode) => {
    setMode(newMode);
    setAuthOpen(true);
    setDropdownOpen(false);
  };

  const openAccount = () => {
    setShowAccount(true);
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
  };

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (error) throw error;

        alert('Account created! Check your email to confirm.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        alert('Signed in successfully.');
      }

      setAuthOpen(false);
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      setErrorMsg(err.message);
    }

    setLoading(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-gray-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo192.png" alt="Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-purple-800">Badgerland Laundry</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-blue-900 font-medium">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/About" className="hover:text-blue-600">About</a>
          <div className="relative">
          <button
  onClick={() => {
    setServicesOpen(!servicesOpen);
    setUserMenuOpen(false);
  }}
  className="hover:text-blue-600"
>
  Services
</button>

{servicesOpen && (
  <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md p-2 w-40">
    <a href="/about" className="block px-4 py-2 hover:bg-blue-50">About</a>
    <a href="/contact" className="block px-4 py-2 hover:bg-blue-50">Contact</a>
  </div>
)}
          </div>
        </nav>

        {/* Icons + CTA */}
        <div className="flex items-center gap-4 relative">
          <a href="/cart" aria-label="Cart" className="text-purple-900 hover:text-purple-600">
            <FaShoppingCart className="cursor-pointer" size={20} />
          </a>

          {/* User icon + dropdown */}
          <button
            aria-label="Account"
            onClick={toggleDropdown}
            className="text-purple-900 hover:text-purple-600 relative"
          >
            <FaUser className="cursor-pointer" size={20} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md py-2 w-48 z-50">
              {!user && (
                <>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50"
                    onClick={() => openAuth('signin')}
                  >
                    Sign In
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50"
                    onClick={() => openAuth('signup')}
                  >
                    Create Account
                  </button>
                </>
              )}
              {user && (
                <>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50"
                    onClick={openAccount}
                  >
                    My Account
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-purple-50"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-800 to-purple-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:from-purple-700 hover:to-purple-400"
          >
            Schedule A Pickup
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setAuthOpen(false)}
            aria-hidden
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-70">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h3>
              <button onClick={() => setAuthOpen(false)} aria-label="Close" className="text-gray-600">✕</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border rounded px-3 py-2"
                />
              </div>

              {errorMsg && (
                <p className="text-red-600 text-sm">{errorMsg}</p>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'signin'
                    ? 'Sign In'
                    : 'Sign Up'}
                </button>

                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-sm text-purple-700 underline"
                >
                  {mode === 'signin'
                    ? 'Create an account'
                    : 'Have an account? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
