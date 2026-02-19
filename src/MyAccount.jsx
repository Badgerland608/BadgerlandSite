import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function MyAccount({ user, setShowAccount }) {
  const [activeTab, setActiveTab] = useState('profile'); // profile | subscription | orders

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
        .maybeSingle();

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
        .maybeSingle();

      if (subData) setSubscription(subData);

      // Load notification settings
      const { data: notifyData } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

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
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6">

        <h2 className="text-2xl font-bold mb-4 text-purple-800 text-center">
          My Account
        </h2>

        {/* TAB NAVIGATION */}
        <div className="flex justify-center gap-4 mb-6 border-b pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-1 font-semibold ${
              activeTab === 'profile'
                ? 'text-purple-800 border-b-2 border-purple-800'
                : 'text-gray-500'
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-1 font-semibold ${
              activeTab === 'subscription'
                ? 'text-purple-800 border-b-2 border-purple-800'
                : 'text-gray-500'
            }`}
          >
            Subscription
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-1 font-semibold ${
              activeTab === 'orders'
                ? 'text-purple-800 border-b-2 border-purple-800'
                : 'text-gray-500'
            }`}
          >
            Orders
          </button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-purple-700">Loading your info...</p>
        ) : (
          <>
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-3 text-sm text-purple-900 mb-6">
                <h3 className="font-semibold text-purple-800">Profile Info</h3>

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
            )}

            {/* SUBSCRIPTION TAB */}
            {activeTab === 'subscription' && (
              <div className="text-sm text-purple-900 mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">Subscription</h3>

                {!subscription ? (
                  <p className="text-purple-700">
                    No active subscription.
                    <a href="/plans" className="underline text-purple-700 ml-1">
                      View plans
                    </a>
                  </p>
                ) : (
                  <SubscriptionDashboard user={user} subscription={subscription} orders={orders} />
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
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
            )}
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

/* -----------------------------
   SUBSCRIPTION DASHBOARD COMPONENT
------------------------------ */

function SubscriptionDashboard({ user, subscription, orders }) {
  const [usage, setUsage] = useState({
    used: 0,
    remaining: subscription.included_lbs,
    savings: 0
  });

  useEffect(() => {
    const loadUsage = async () => {
      const start = new Date();
      start.setDate(1);
      const startStr = start.toISOString().split("T")[0];

      const { data: monthOrders } = await supabase
        .from("orders")
        .select("pounds, total_price")
        .eq("user_id", user.id)
        .gte("created_at", startStr);

      if (!monthOrders) return;

      const used = monthOrders.reduce((sum, o) => sum + (o.pounds || 0), 0);
      const remaining = Math.max(subscription.included_lbs - used, 0);

      const payAsYouGoCost = used * 1.60;
      const subscriberCost =
        used <= subscription.included_lbs
          ? 0
          : (used - subscription.included_lbs) * subscription.extra_rate;

      const savings = Math.max(payAsYouGoCost - subscriberCost, 0);

      setUsage({
        used,
        remaining,
        savings: Math.round(savings * 100) / 100
      });
    };

    loadUsage();
  }, [user.id, subscription]);

  const renewalDate = new Date(subscription.renewal_date);
  const today = new Date();
  const daysLeft = Math.max(
    Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24)),
    0
  );

  return (
    <div className="border border-purple-200 rounded p-3 bg-purple-50 space-y-4">

      {/* PLAN INFO */}
      <div>
        <p><strong>Plan:</strong> {subscription.plan_name}</p>
        <p><strong>Included lbs:</strong> {subscription.included_lbs}</p>
        <p><strong>Extra rate:</strong> ${subscription.extra_rate}/lb</p>
        <p><strong>Renews:</strong> {subscription.renewal_date}</p>
        <p><strong>Days until renewal:</strong> {daysLeft}</p>
      </div>

      {/* SAVINGS */}
      <div className="bg-green-100 border border-green-300 p-3 rounded">
        <p className="text-green-800 font-semibold">
          Estimated savings this month: ${usage.savings}
        </p>
      </div>

      {/* MONTHLY USAGE GRAPH */}
      <div>
        <h4 className="font-semibold text-purple-800 mb-1">Monthly Usage</h4>
        <UsageBar used={usage.used} included={subscription.included_lbs} />
      </div>

      {/* ORDER-BY-ORDER CHART */}
      <div>
        <h4 className="font-semibold text-purple-800 mb-1">Usage Per Order</h4>
        <OrderChart orders={orders} />
      </div>

      {/* BILLING PORTAL */}
      <a
        href="https://billing.stripe.com/p/login"
        className="block text-center bg-purple-700 text-white py-2 rounded font-semibold hover:bg-purple-800 transition"
      >
        Manage Billing
      </a>
    </div>
  );
}

/* -----------------------------
   SVG USAGE BAR
------------------------------ */

function UsageBar({ used, included }) {
  const percent = Math.min((used / included) * 100, 100);

  return (
    <div className="w-full bg-purple-200 rounded h-4 relative">
      <div
        className="bg-purple-700 h-4 rounded"
        style={{ width: `${percent}%` }}
      ></div>
      <span className="absolute inset-0 flex justify-center items-center text-xs text-white font-semibold">
        {used} lbs / {included} lbs
      </span>
    </div>
  );
}

/* -----------------------------
   SVG ORDER-BY-ORDER BAR CHART
------------------------------ */

function OrderChart({ orders }) {
  if (!orders || orders.length === 0)
    return <p className="text-purple-700 text-sm">No orders yet.</p>;

  const max = Math.max(...orders.map((o) => o.pounds || 0), 1);

  return (
    <svg width="100%" height="120">
      {orders.slice(0, 6).map((order, i) => {
        const height = ((order.pounds || 0) / max) * 100;

        return (
          <rect
            key={order.id}
            x={i * 40 + 10}
            y={110 - height}
            width="30"
            height={height}
            fill="#6b21a8"
            rx="4"
          />
        );
      })}
    </svg>
  );
}