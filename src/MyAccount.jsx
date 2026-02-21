import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function MyAccount({ user, setShowAccount }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: ''
  });

  const [subscription, setSubscription] = useState(null);

  const [notifySettings, setNotifySettings] = useState({
    email_enabled: false,
    sms_enabled: false,
    phone: ''
  });

  const [orders, setOrders] = useState([]);

  /* ===============================
     LOAD ACCOUNT DATA (SAFE)
  =============================== */
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);

      try {
        // PROFILE
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone, address')
          .eq('id', user.id)
          .maybeSingle();

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

        if (!cancelled) {
          setSubscription(subData || null);
        }

        // NOTIFICATIONS
        const { data: notifyData } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!cancelled && notifyData) {
          setNotifySettings({
            email_enabled: notifyData.email_enabled ?? false,
            sms_enabled: notifyData.sms_enabled ?? false,
            phone: notifyData.phone || ''
          });
        }

        // ORDERS
        const { data: ordersData } = await supabase
          .from('orders')
          .select(
            'id, pickup_time, delivery_time, pounds, total_price, status, created_at'
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!cancelled && ordersData) {
          setOrders(ordersData);
        }

      } catch (err) {
        if (!cancelled) {
          console.error('MyAccount load error:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };

  }, [user?.id]);

  /* ===============================
     HANDLERS
  =============================== */

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotifyChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNotifySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        ...profile
      });
    } catch (err) {
      console.error('Profile save error:', err);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user?.id) return;

    try {
      await supabase.from('notification_settings').upsert({
        user_id: user.id,
        ...notifySettings
      });
    } catch (err) {
      console.error('Notification save error:', err);
    }
  };

  /* ===============================
     SAFE SUBSCRIPTION CALCULATIONS
  =============================== */

  const includedLbs = subscription?.included_lbs ?? 0;
  const usedLbs = subscription?.used_lbs ?? 0;
  const remainingLbs = Math.max(includedLbs - usedLbs, 0);

  /* ===============================
     UI
  =============================== */

  return (
    <div className="account-wrapper">
      <div className="account-header">
        <h2>My Account</h2>
        <button onClick={() => setShowAccount(false)}>Close</button>
      </div>

      <div className="account-tabs">
        <button onClick={() => setActiveTab('profile')}>Profile</button>
        <button onClick={() => setActiveTab('subscription')}>Subscription</button>
        <button onClick={() => setActiveTab('orders')}>Orders</button>
      </div>

      {loading && <p>Loading...</p>}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div>
          <input
            name="full_name"
            value={profile.full_name}
            onChange={handleProfileChange}
            placeholder="Full Name"
          />
          <input
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            placeholder="Phone"
          />
          <input
            name="address"
            value={profile.address}
            onChange={handleProfileChange}
            placeholder="Address"
          />
          <button onClick={handleSaveProfile}>Save Profile</button>

          <hr />

          <h4>Notifications</h4>

          <label>
            <input
              type="checkbox"
              name="email_enabled"
              checked={notifySettings.email_enabled}
              onChange={handleNotifyChange}
            />
            Email
          </label>

          <label>
            <input
              type="checkbox"
              name="sms_enabled"
              checked={notifySettings.sms_enabled}
              onChange={handleNotifyChange}
            />
            SMS
          </label>

          <input
            name="phone"
            value={notifySettings.phone}
            onChange={handleNotifyChange}
            placeholder="SMS Phone"
          />

          <button onClick={handleSaveNotifications}>
            Save Notifications
          </button>
        </div>
      )}

      {/* SUBSCRIPTION TAB */}
      {activeTab === 'subscription' && (
        <div>
          {subscription ? (
            <>
              <p><strong>Plan:</strong> {subscription.plan_name}</p>
              <p><strong>Included Lbs:</strong> {includedLbs}</p>
              <p><strong>Used:</strong> {usedLbs}</p>
              <p><strong>Remaining:</strong> {remainingLbs}</p>
            </>
          ) : (
            <p>No active subscription.</p>
          )}
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="order-card">
                <p>Status: {order.status}</p>
                <p>Pounds: {order.pounds}</p>
                <p>Total: ${order.total_price}</p>
                <p>Pickup: {order.pickup_time}</p>
                <p>Delivery: {order.delivery_time}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}