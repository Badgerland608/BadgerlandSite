import { useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function LoginModal({ setShowLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Logged in successfully.');
    setShowLogin(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-purple-300 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800 text-center">
          Log In to Badgerland
        </h2>

        <form onSubmit={handleLogin} className="space-y-3 text-sm text-purple-900">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-purple-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-purple-300 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <button
          onClick={() => setShowLogin(false)}
          className="mt-4 text-xs text-purple-500 hover:underline block text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
