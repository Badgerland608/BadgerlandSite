import { useEffect, useState, useRef } from 'react';
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

  // ⭐ NEW — subscriber weekly pickup preferences
  const [pickupDay, setPickupDay] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [notifySettings, setNotifySettings] = useState({
    email_enabled: true,
    sms_enabled: false,
    phone: ''
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);

  /* ===========================
     MOUNT / UNMOUNT SAFETY
  ============================ */
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ===========================
     RESET STATE ON LOGOUT
  ============================ */
  useEffect(() => {
    if (!user?.id) {
      if (!isMounted.current) return;

      setActiveTab('profile');
      setProfile({ full_name: '', phone: '', address: '' });
      setOrders([]);
      setSubscription(null);
      setPickupDay("");
      setPickupTime("");

      setNotifySettings({
        email_enabled: true,
        sms_enabled: false,
        phone: ''
      });

      setLoading(false);
    }
  }, [user?.id]);

  /* ===========================
     LOAD ACCOUNT DATA
  ============================ */
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);

      try {
        /* PROFILE */
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone, address')
          .eq('id', user.id)
          .maybeSingle();

        if (!cancelled && isMounted.current) {
          setProfile({
            full_name: profileData?.full_name || '',
            phone: profileData?.phone || '',
            address: profileData?.address || ''
          });
        }

        /* SUBSCRIPTION */
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .maybeSingle();

        if (!cancelled && isMounted.current) {
          setSubscription(subData || null);

          // ⭐ Load subscriber weekly preferences
          setPickupDay(subData?.pickup_day || "");
          setPickupTime(subData?.pickup_time || "");
        }

        /* NOTIFICATION SETTINGS */
        const { data: notifyData } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!cancelled && isMounted.current) {
          setNotifySettings({
            email_enabled: notifyData?.email_enabled ?? true,
            sms_enabled: notifyData?.sms_enabled ?? false,
            phone: notifyData?.phone || ''
          });
        }

        /* ORDERS */
        const { data: ordersData } = await supabase
          .from('orders')
          .select(
            'id, pickup_time, delivery_time, pounds, total_price, status, created_at'
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!cancelled && isMounted.current) {
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error('MyAccount load error:', err);
      } finally {
        if (!cancelled && isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  /* ===========================
     FORM HANDLERS
  ============================ */
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
    if (!user?.id) return;

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
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      if (isMounted.current) setSaving(false);
    }
  };

  /* ===========================
     ⭐ SAVE SUBSCRIBER PREFERENCES
  ============================ */
  async function savePreferences() {
    if (!subscription) return;

    const { error } = await supabase
      .from("subscriptions")
      .update({
        pickup_day: pickupDay,
        pickup_time: pickupTime
      })
      .eq("user_id", user.id);

    if (error) {
      alert("Error saving preferences");
      console.error(error);
    } else {
      alert("Preferences saved!");
    }
  }

  /* ===========================
     UI
  ============================ */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-800 text-center">
          My Account
        </h2>

        <div className="flex justify-center gap-4 mb-6 border-b pb-2">
          {['profile', 'subscription', 'orders'].map((tab) => (
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
          <p className="text-center text-sm text-purple-700">
            Loading your info...
          </p>
        ) : (
          <>
            {activeTab === 'profile' && (
              <form
                onSubmit={handleSave}
                className="space-y-3 text-sm text-purple-900 mb-6"
              >
                <input
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-purple-300 rounded"
                  placeholder="Full Name"
                />

                <input
                  name="email_address"
                  value={profile.email_address}
                  onChange={handleChange}
                  className="w-full p-2 border border-purple-300 rounded"
                  placeholder="Email Address"
                />

                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-purple-300 rounded"
                  placeholder="Phone Number"
                />

                <input
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-purple-300 rounded"
                  placeholder="Default Pickup Address"
                />

                <button
                  disabled={saving}
                  className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'subscription' && subscription && (
              <>
                <SubscriptionDashboard user={user} subscription={subscription} />

                {/* ⭐ NEW — Weekly Pickup Preferences */}
                <div className="mt-6 p-4 border rounded-lg bg-purple-50">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">
                    Weekly Pickup Preferences
                  </h3>

                  <label className="block text-sm font-medium text-purple-700">
                    Pickup Day
                  </label>
                  <select
                    value={pickupDay}
                    onChange={(e) => setPickupDay(e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded mb-3"
                  >
                    <option value="">Select a day</option>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>

                  <label className="block text-sm font-medium text-purple-700">
                    Pickup Time Window
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded mb-3"
                  >
                    <option value="">Select a time</option>
                    {[
                      "8:00 AM - 10:00 AM",
                      "10:30 AM - 12:30 PM",
                      "1:00 PM - 3:00 PM",
                      "4:00 PM - 6:00 PM",
                    ].map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>

                  <button
                    onClick={savePreferences}
                    className="w-full bg-purple-700 text-white py-2 rounded font-semibold"
                  >
                    Save Preferences
                  </button>
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="text-sm text-purple-900">
                {(orders || []).map((order) => (
                  <div
                    key={order.id}
                    className="border border-purple-200 rounded p-2 mb-2"
                  >
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Pounds:</strong> {order.pounds || 0}</p>
                    <p>
                      <strong>Total:</strong>{' '}
                      ${(order.total_price || 0).toFixed(2)}
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

/* ===========================
   SUBSCRIPTION DASHBOARD
=========================== */
function SubscriptionDashboard({ user, subscription }) {
  const [usage, setUsage] = useState({
    used: 0,
    remaining: subscription?.included_lbs ?? 0,
    savings: 0
  });

  useEffect(() => {
    if (!user?.id || !subscription) return;

    let cancelled = false;

    const loadUsage = async () => {
      try {
        const start = new Date();
        start.setDate(1);

        const { data } = await supabase
          .from('orders')
          .select('pounds')
          .eq('user_id', user.id)
          .gte('created_at', start.toISOString());

        if (cancelled) return;

        const used = (data || []).reduce(
          (sum, o) => sum + (o.pounds || 0),
          0
        );

        setUsage({
          used,
          remaining: Math.max((subscription.included_lbs || 0) - used, 0),
          savings: 0
        });
      } catch (err) {
        console.error('Usage load error:', err);
      }
    };

    loadUsage();

    return () => {
      cancelled = true;
    };
  }, [user?.id, subscription]);

  return (
    <div className="border border-purple-200 rounded p-3 bg-purple-50">
      <p className="font-semibold text-purple-800 mb-2">
        {subscription.plan_name}
      </p>

      <UsageBar
        used={usage.used}
        included={subscription?.included_lbs ?? 0}
      />
    </div>
  );
}

function UsageBar({ used, included }) {
  const safeIncluded = Math.max(included || 1, 1);
  const percent = Math.min((used / safeIncluded) * 100, 100);

  return (
    <div className="w-full bg-purple-200 rounded h-4 relative">
      <div
        className="bg-purple-700 h-4 rounded"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}