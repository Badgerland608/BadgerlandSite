import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function MyAccount({ user, setShowAccount }) {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: ''
  });
  const [orders, setOrders] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          address: profileData.address || ''
        });
      }

      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, pickup_date, pickup_time, estimate, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersData) setOrders(ordersData);

      setLoading(false);
    };

    loadData();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address
    });

    setSaving(false);
    alert('Profile updated.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-800 text-center">
          My Account
        </h2>

        {loading ? (
          <p className="text-center text-sm text-purple-700">Loading your info...</p>
        ) : (
          <>
            <form onSubmit={handleSave} className="space-y-3 text-sm text-purple-900 mb-6">
              <h3 className="font-semibold text-purple-800">Profile</h3>

              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={profile.full_name}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={profile.phone}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Default Pickup Address"
                value={profile.address}
                onChange={handleChange}
                className="w-full p-2 border border-purple-300 rounded"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>

            <div className="text-sm text-purple-900">
              <h3 className="font-semibold text-purple-800 mb-2">Order History</h3>
              {orders.length === 0 && (
                <p className="text-purple-700">No orders yet. Schedule your first pickup!</p>
              )}
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-purple-200 rounded p-2 mb-2"
                >
                  <p><span className="font-semibold">Pickup:</span> {order.pickup_date} at {order.pickup_time}</p>
                  <p><span className="font-semibold">Estimated:</span> ${order.estimate}</p>
                  <p><span className="font-semibold">Status:</span> {order.status}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setShowAccount(false)}
          className="mt-4 text-xs text-purple-500 hover:underline block text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
}
