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
  const [notifySettings, setNotifySettings] = useState({
    email_enabled: true,
    sms_enabled: false,
    phone: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);

  /* ===========================
     CLEANUP ON UNMOUNT
  =========================== */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ===========================
     RESET STATE ON LOGOUT
  =========================== */
  useEffect(() => {
    if (!user?.id) {
      setProfile({ full_name: '', phone: '', address: '' });
      setOrders([]);
      setSubscription(null);
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
  =========================== */
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone, address')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData && isMounted.current) {
          setProfile({
            full_name: profileData.full_name || '',
            phone: profileData.phone || '',
            address: profileData.address || ''
          });
        }

        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .maybeSingle();

        if (isMounted.current) setSubscription(subData || null);

        const { data: notifyData } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (notifyData && isMounted.current) {
          setNotifySettings({
            email_enabled: notifyData.email_enabled,
            sms_enabled: notifyData.sms_enabled,
            phone: notifyData.phone || ''
          });
        }

        const { data: ordersData } = await supabase
          .from('orders')
          .select(
            'id, pickup_time, delivery_time, pounds, total_price, status, created_at'
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersData && isMounted.current) {
          setOrders(ordersData);
        }

      } catch (err) {
        console.error('MyAccount load error:', err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  /* ===========================
     FORM HANDLERS
  =========================== */
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
      setSaving(false);
    }
  };

  /* ===========================
     UI
  =========================== */
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
              <SubscriptionDashboard
                user={user}
                subscription={subscription}
                orders={orders}
              />
            )}

            {activeTab === 'orders' && (
              <div className="text-sm text-purple-900">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-purple-200 rounded p-2 mb-2"
                  >
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Pounds:</strong> {order.pounds || 0}</p>
                    <p><strong>Total:</strong> ${(order.total_price || 0).toFixed(2)}</p>
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
function SubscriptionDashboard({ user, subscription, orders }) {
  const [usage, setUsage] = useState({
    used: 0,
    remaining: subscription?.included_lbs ?? 0,
    savings: 0
  });

  useEffect(() => {
    if (!user?.id || !subscription) return;

    const loadUsage = async () => {
      try {
        const start = new Date();
        start.setDate(1);

        const { data } = await supabase
          .from('orders')
          .select('pounds')
          .eq('user_id', user.id)
          .gte('created_at', start.toISOString());

        if (!data) return;

        const used = data.reduce((sum, o) => sum + (o.pounds || 0), 0);

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