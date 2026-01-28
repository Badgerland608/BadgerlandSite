import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function MyAccount({ user, setShowAccount }) {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: ''
  });

  const [orders, setOrders] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [notifySettings, setNotifySettings] = useState({
    email_enabled: true,
    sms_enabled: false,
    phone: ''
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Load profile
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

      // Load subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (subData) setSubscription(subData);

      // Load notification settings
      const { data: notifyData } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (notifyData) {
        setNotifySettings({
          email_enabled: notifyData.email_enabled,
          sms_enabled: notifyData.sms_enabled,
          phone: notifyData.phone || ''
        });
      }

      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, pickup_time, delivery_time, pounds, total_price, status, created_at')
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

  const handleNotifyChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNotifySettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Save profile
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address
    });

    // Save notification settings
    await supabase.from('notification_settings').upsert({
      user_id: user.id,
      email_enabled: notifySettings.email_enabled,
      sms_enabled: notifySettings.sms_enabled,
      phone: notifySettings.phone
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
            {/* PROFILE FORM */}
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

              {/* NOTIFICATION SETTINGS */}
              <h3 className="font-semibold text-purple-800 mt-4">Notifications</h3>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="email_enabled"
                  checked={notifySettings.email_enabled}
                  onChange={handleNotifyChange}
                />
                Email Notifications
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="sms_enabled"
                  checked={notifySettings.sms_enabled}
                  onChange={handleNotifyChange}
                />
                SMS Notifications
              </label>

              <input
                type="text"
                name="phone"
                placeholder="SMS Phone Number"
                value={notifySettings.phone}
                onChange={handleNotifyChange}
                className="w-full p-2 border border-purple-300 rounded"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            {/* SUBSCRIPTION SECTION */}
            <div className="text-sm text-purple-900 mb-6">
              <h3 className="font-semibold text-purple-800 mb-2">Subscription</h3>

              {!subscription ? (
                <p className="text-purple-700">No active subscription.</p>
              ) : (
                <div className="border border-purple-200 rounded p-3 bg-purple-50">
                  <p><strong>Plan:</strong> {subscription.plan_name}</p>
                  <p><strong>Included lbs:</strong> {subscription.included_lbs}</p>
                  <p><strong>Extra rate:</strong> ${subscription.extra_rate}/lb</p>
                  <p><strong>Renews:</strong> {subscription.renewal_date}</p>
                </div>
              )}
            </div>

            {/* ORDER HISTORY */}
            <div className="text-sm text-purple-900">
              <h3 className="font-semibold text-purple-800 mb-2">Order History</h3>

              {orders.length === 0 && (
                <p className="text-purple-700">No orders yet. Schedule your first pickup!</p>
              )}

              {orders.map((order) => (
                <div key={order.id} className="border border-purple-200 rounded p-2 mb-2">
                  <p><strong>Status:</strong> {order.status.replace(/_/g, ' ')}</p>
                  <p><strong>Pounds:</strong> {order.pounds}</p>
                  <p><strong>Total:</strong> ${order.total_price?.toFixed(2)}</p>
                  <p><strong>Pickup:</strong> {order.pickup_time}</p>
                  <p><strong>Delivery:</strong> {order.delivery_time}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
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