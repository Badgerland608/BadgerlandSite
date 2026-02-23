import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'; // Added for the empty state
import { supabase } from './lib/supabaseClient';

export default function MyAccount({ user, setShowAccount }) {
  // Guard against missing user to prevent crashes, but keep it inside the return logic
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    email_address: ''
  });

  const [orders, setOrders] = useState([]);
  const [subscription, setSubscription] = useState(null);
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

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  /* ===========================
     LOAD ACCOUNT DATA
  ============================ */
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      if (isMounted.current) setLoading(true);

      try {
        // 1. Load Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone, address, email_address')
          .eq('id', user.id)
          .maybeSingle();

        if (isMounted.current) {
          setProfile({
            full_name: profileData?.full_name || '',
            phone: profileData?.phone || '',
            address: profileData?.address || '',
            email_address: profileData?.email_address || ''
          });
        }

        // 2. Load Subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .maybeSingle();

        if (isMounted.current) {
          setSubscription(subData || null);
          setPickupDay(subData?.pickup_day || "");
          setPickupTime(subData?.pickup_time || "");
        }

        // 3. Load Notification Settings
        const { data: notifyData } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (isMounted.current) {
          setNotifySettings({
            email_enabled: notifyData?.email_enabled ?? true,
            sms_enabled: notifyData?.sms_enabled ?? false,
            phone: notifyData?.phone || ''
          });
        }

        // 4. Load Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, pickup_time, delivery_time, pounds, total_price, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (isMounted.current) setOrders(ordersData || []);

      } catch (err) {
        console.error('MyAccount load error:', err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
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
        address: profile.address,
        email_address: profile.email_address
      });
      alert("Profile updated!");
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      if (isMounted.current) setSaving(false);
    }
  };

  async function savePreferences() {
    if (!subscription) return;
    const { error } = await supabase
      .from("subscriptions")
      .update({ pickup_day: pickupDay, pickup_time: pickupTime })
      .eq("user_id", user.id);

    if (error) alert("Error saving preferences");
    else alert("Preferences saved!");
  }

  // If user is null, we shouldn't show the modal at all
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl border border-purple-300 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-800">My Account</h2>
          <button onClick={() => setShowAccount(false)} className="text-gray-400 hover:text-purple-800 text-2xl font-bold">&times;</button>
        </div>

        <div className="flex justify-center gap-4 mb-6 border-b pb-2">
          {['profile', 'subscription', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 font-semibold transition-colors ${
                activeTab === tab ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-500 hover:text-purple-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-sm text-purple-700">Loading your info...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-3 text-sm text-purple-900 mb-6">
                <input name="full_name" value={profile.full_name} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" placeholder="Full Name" />
                <input name="email_address" value={profile.email_address} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" placeholder="Email Address" />
                <input name="phone" value={profile.phone} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" placeholder="Phone Number" />
                <input name="address" value={profile.address} onChange={handleChange} className="w-full p-2 border border-purple-300 rounded" placeholder="Default Pickup Address" />
                <button disabled={saving} className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'subscription' && (
              subscription ? (
                <>
                  <SubscriptionDashboard user={user} subscription={subscription} />
                  <div className="mt-6 p-4 border rounded-lg bg-purple-50">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">Weekly Pickup Preferences</h3>
                    <select value={pickupDay} onChange={(e) => setPickupDay(e.target.value)} className="w-full p-2 border border-purple-300 rounded mb-3">
                      <option value="">Select a day</option>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                    <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full p-2 border border-purple-300 rounded mb-3">
                      <option value="">Select a time</option>
                      {["8:00 AM - 10:00 AM", "10:30 AM - 12:30 PM", "1:00 PM - 3:00 PM", "4:00 PM - 6:00 PM"].map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                    <button onClick={savePreferences} className="w-full bg-purple-700 text-white py-2 rounded font-semibold hover:bg-purple-800 transition">Save Preferences</button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-purple-200 rounded-lg">
                  <p className="text-gray-500 mb-4">No active subscription found.</p>
                  <Link to="/plans" onClick={() => setShowAccount(false)} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold hover:bg-purple-200 transition">View Plans</Link>
                </div>
              )
            )}

            {activeTab === 'orders' && (
              <div className="text-sm text-purple-900 max-h-60 overflow-y-auto pr-2">
                {orders.length > 0 ? orders.map((order) => (
                  <div key={order.id} className="border border-purple-200 rounded p-3 mb-2 bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                       <p className="font-bold text-purple-800">{new Date(order.created_at).toLocaleDateString()}</p>
                       <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs uppercase">{order.status}</span>
                    </div>
                    <p className="text-xs text-gray-500">Pounds: {order.pounds || 0} lbs</p>
                    <p className="text-xs font-semibold">Total: ${(order.total_price || 0).toFixed(2)}</p>
                  </div>
                )) : <p className="text-center text-gray-500 py-4">No orders yet.</p>}
              </div>
            )}
          </div>
        )}

        <button onClick={() => setShowAccount(false)} className="mt-6 w-full py-2 text-sm text-purple-500 hover:text-purple-800 font-medium border-t border-purple-100 pt-4">
          Close Account Settings
        </button>
      </div>
    </div>
  );
}

/* ===========================
   SUBSCRIPTION DASHBOARD
=========================== */
function SubscriptionDashboard({ user, subscription }) {
  const [usage, setUsage] = useState({ used: 0, remaining: subscription?.included_lbs ?? 0 });

  useEffect(() => {
    if (!user?.id || !subscription) return;
    const loadUsage = async () => {
      const start = new Date();
      start.setDate(1); // Start of current month
      const { data } = await supabase.from('orders').select('pounds').eq('user_id', user.id).gte('created_at', start.toISOString());
      const used = (data || []).reduce((sum, o) => sum + (o.pounds || 0), 0);
      setUsage({ used, remaining: Math.max((subscription.included_lbs || 0) - used, 0) });
    };
    loadUsage();
  }, [user?.id, subscription]);

  return (
    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 shadow-inner">
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-purple-800">{subscription.plan_name}</p>
        <p className="text-xs font-bold text-purple-600 uppercase">Active Plan</p>
      </div>
      <p className="text-xs text-purple-700 mb-2">Usage: {usage.used} / {subscription.included_lbs} lbs</p>
      <UsageBar used={usage.used} included={subscription?.included_lbs ?? 0} />
      <p className="text-[10px] text-gray-400 mt-2 italic">*Usage resets at the first of the month</p>
    </div>
  );
}

function UsageBar({ used, included }) {
  const safeIncluded = Math.max(included || 1, 1);
  const percent = Math.min((used / safeIncluded) * 100, 100);
  return (
    <div className="w-full bg-purple-200 rounded-full h-3 relative overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-800 h-full transition-all duration-500" style={{ width: `${percent}%` }} />
    </div>
  );
}