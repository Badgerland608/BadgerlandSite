import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function MyAccount({ user, setShowAccount }) {
  const [activeTab, setActiveTab] = useState('profile');
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
    // 🔒 Guard: user not ready yet
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);

        // PROFILE
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, phone, address')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!cancelled && profileData) {
          setProfile({
            full_name: profileData.full_name || '',
            phone: profileData.phone || '',
            address: profileData.address || ''
          });
        }

        // SUBSCRIPTION
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .maybeSingle();

        if (!cancelled) setSubscription(subData || null);

        // NOTIFICATIONS
        const { data: notifyData } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!cancelled && notifyData) {
          setNotifySettings({
            email_enabled: notifyData.email_enabled,
            sms_enabled: notifyData.sms_enabled,
            phone: notifyData.phone || ''
          });
        }

        // ORDERS
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, pickup_time, delivery_time, pounds, total_price, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!cancelled && ordersData) setOrders(ordersData);

      } catch (err) {
        console.error('MyAccount load error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

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

    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address
      });

      await supabase.from('notification_settings').upsert({
        user_id: user.id,
        email_enabled: notifySettings.email_enabled,
        sms_enabled: notifySettings.sms_enabled,
        phone: notifySettings.phone
      });

      alert('Profile updated.');
    } catch (err) {
      console.error(err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-800 text-center">
          My Account
        </h2>

        {/* TABS */}
        <div className="flex justify-center gap-4 mb-6 border-b pb-2">
          {['profile', 'subscription', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 font-semibold ${
                activeTab === tab
                  ? 'text-purple-800 border-b-2 border-purple-800'
                  : 'text-gray-500'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-purple-700">Loading your info…</p>
        ) : (
          <>
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-3 text-sm">
                <input
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full p-2 border rounded"
                />
                <input
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  placeholder="Pickup Address"
                  className="w-full p-2 border rounded"
                />

                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="email_enabled"
                    checked={notifySettings.email_enabled}
                    onChange={handleNotifyChange}
                  />
                  Email Notifications
                </label>

                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    name="sms_enabled"
                    checked={notifySettings.sms_enabled}
                    onChange={handleNotifyChange}
                  />
                  SMS Notifications
                </label>

                <input
                  name="phone"
                  value={notifySettings.phone}
                  onChange={handleNotifyChange}
                  placeholder="SMS Phone"
                  className="w-full p-2 border rounded"
                />

                <button
                  disabled={saving}
                  className="w-full bg-purple-700 text-white py-2 rounded"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'subscription' && (
              <SubscriptionDashboard
                user={user}
                subscription={subscription}
                orders={orders}
              />
            )}

            {activeTab === 'orders' && (
              <div className="space-y-2">
                {orders.length === 0 && <p>No orders yet.</p>}
                {orders.map(o => (
                  <div key={o.id} className="border p-2 rounded">
                    <p>Status: {o.status}</p>
                    <p>Pounds: {o.pounds}</p>
                    <p>Total: ${o.total_price?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <button
          onClick={() => setShowAccount(false)}
          className="mt-4 text-sm text-purple-600 underline block mx-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* -----------------------------
   SUBSCRIPTION DASHBOARD
------------------------------ */

function SubscriptionDashboard({ user, subscription, orders }) {
  if (!subscription) {
    return <p>No active subscription. <a href="/plans" className="underline">View plans</a></p>;
  }

  const used = orders.reduce((sum, o) => sum + (o.pounds || 0), 0);
  const remaining = Math.max(subscription.included_lbs - used, 0);

  return (
    <div className="border p-4 rounded bg-purple-50">
      <p><strong>Plan:</strong> {subscription.plan_name}</p>
      <p><strong>Included lbs:</strong> {subscription.included_lbs}</p>
      <p><strong>Remaining:</strong> {remaining}</p>
      <UsageBar used={used} included={subscription.included_lbs} />
    </div>
  );
}

function UsageBar({ used, included }) {
  const percent = Math.min((used / included) * 100, 100);
  return (
    <div className="w-full bg-purple-200 rounded h-4 mt-2 relative">
      <div
        className="bg-purple-700 h-4 rounded"
        style={{ width: `${percent}%` }}
      />
      <span className="absolute inset-0 text-xs text-white flex justify-center items-center">
        {used} / {included} lbs
      </span>
    </div>
  );
}