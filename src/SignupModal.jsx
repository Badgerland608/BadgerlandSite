import { useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function SignupModal({ setShowSignup }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Check your email to confirm your account.');
    setShowSignup(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl border border-purple-300 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800 text-center">
          Create Your Badgerland Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-3 text-sm text-purple-900">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border border-purple-300 rounded"
            required
          />
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
            placeholder="Create Password"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setShowSignup(false)}
          className="mt-4 text-xs text-purple-500 hover:underline block text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
