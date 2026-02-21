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
  const [orders, setOrders] = useState([]);

  // ✅ SAFE DATA LOADING
  useEffect(() => {
    if (!user?.id) return; // Prevent crash on login/logout timing

    const loadData = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriptionData) {
        setSubscription(subscriptionData);
      }

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }

      setLoading(false);
    };

    loadData();
  }, [user?.id]); // ✅ Safe dependency

  return (
    <div className="my-account">
      <div className="account-header">
        <h2>My Account</h2>
        <button onClick={() => setShowAccount(false)}>Close</button>
      </div>

      <div className="account-tabs">
        <button onClick={() => setActiveTab('profile')}>
          Profile
        </button>
        <button onClick={() => setActiveTab('subscription')}>
          Subscription
        </button>
        <button onClick={() => setActiveTab('orders')}>
          Orders
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="profile-tab">
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
        </div>
      )}

      {/* SUBSCRIPTION TAB */}
      {activeTab === 'subscription' && subscription && (
        <SubscriptionDashboard
          user={user}
          subscription={subscription}
          orders={orders}
        />
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="orders-tab">
          {orders.length === 0 && <p>No orders found.</p>}
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ${order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================= */
/* SUBSCRIPTION DASHBOARD        */
/* ============================= */

function SubscriptionDashboard({ user, subscription, orders }) {
  const [usage, setUsage] = useState({
    used: 0,
    remaining: subscription?.included_lbs || 0, // ✅ Safe default
    savings: 0
  });

  useEffect(() => {
    if (!subscription) return;

    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    });

    const totalUsed = monthlyOrders.reduce(
      (sum, order) => sum + (order.weight_lbs || 0),
      0
    );

    setUsage({
      used: totalUsed,
      remaining: Math.max(
        (subscription?.included_lbs || 0) - totalUsed,
        0
      ),
      savings: totalUsed * (subscription?.discount_per_lb || 0)
    });
  }, [orders, subscription]);

  return (
    <div className="subscription-dashboard">
      <h3>{subscription.plan_name}</h3>

      <UsageBar
        used={usage.used}
        included={subscription?.included_lbs || 0}
      />

      <p><strong>Remaining:</strong> {usage.remaining} lbs</p>
      <p><strong>Estimated Savings:</strong> ${usage.savings.toFixed(2)}</p>
    </div>
  );
}

/* ============================= */
/* USAGE BAR                     */
/* ============================= */

function UsageBar({ used, included }) {
  const safeIncluded = Math.max(included || 0, 1); // ✅ Prevent divide by zero
  const percent = Math.min((used / safeIncluded) * 100, 100);

  return (
    <div className="usage-bar">
      <div
        className="usage-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}