import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function AdminDashboard({ user }) {
  if (!user) return null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("orders"); // Toggle: 'orders' or 'dispatch'

  const [stats, setStats] = useState({ totalOrders: 0, activeCustomers: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [dispatch, setDispatch] = useState({}); // Grouped by day
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // Weight modal state
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightOrder, setWeightOrder] = useState(null);
  const [weightInput, setWeightInput] = useState("");

  const ORDER_STATUSES = ["scheduled", "picked_up", "washing", "drying", "ready_for_delivery", "delivered", "completed"];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Stats & Orders
      const { data: allOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      const { count: customerCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("active", true);
      
      const totalRev = allOrders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;
      setStats({ totalOrders: allOrders?.length || 0, activeCustomers: customerCount || 0, revenue: totalRev });
      setOrders(allOrders || []);

      // 2. Weekly Dispatch (Subscriptions)
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('pickup_day, pickup_time, user_id, profiles(full_name, phone, address)')
        .eq('active', true)
        .not('pickup_day', 'is', null);

      const grouped = subs?.reduce((acc, curr) => {
        const day = curr.pickup_day;
        if (!acc[day]) acc[day] = [];
        acc[day].push(curr);
        return acc;
      }, {}) || {};
      
      setDispatch(grouped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Error: " + err.message);
    }
    setUpdatingOrder(null);
  };

  // Save weight & Mark Completed
  const saveWeight = async () => {
    if (!weightInput || isNaN(weightInput)) return alert("Enter weight.");
    try {
      const { error } = await supabase.from("orders").update({
        pounds: Number(weightInput),
        status: "completed",
      }).eq("id", weightOrder.id);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === weightOrder.id ? { ...o, pounds: Number(weightInput), status: "completed" } : o));
      setShowWeightModal(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Admin Data...</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#804FB3]">Admin Portal</h1>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => setActiveView('orders')}
              className={`px-4 py-2 rounded-lg font-bold transition ${activeView === 'orders' ? 'bg-[#804FB3] text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              Recent Orders
            </button>
            <button 
              onClick={() => setActiveView('dispatch')}
              className={`px-4 py-2 rounded-lg font-bold transition ${activeView === 'dispatch' ? 'bg-[#56941E] text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              Weekly Dispatch
            </button>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500 font-bold uppercase">Monthly Revenue</p>
          <p className="text-3xl font-black text-gray-900">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      {activeView === 'orders' ? (
        /* ORDERS VIEW */
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-[#804FB3] font-bold">Customer</th>
                <th className="p-4 text-[#804FB3] font-bold">Status</th>
                <th className="p-4 text-[#804FB3] font-bold">Lbs</th>
                <th className="p-4 text-[#804FB3] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.customer_email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{order.pounds || '—'}</td>
                  <td className="p-4 space-x-2">
                    <select 
                      className="text-xs border rounded p-1"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button 
                      onClick={() => { setWeightOrder(order); setShowWeightModal(true); }}
                      className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md font-bold"
                    >
                      Weight
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* DISPATCH VIEW */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS.map(day => (
            <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-black text-lg text-[#804FB3] border-b pb-2 mb-4">{day}</h3>
              <div className="space-y-4">
                {dispatch[day]?.map((item, i) => (
                  <div key={i} className="text-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-bold text-gray-900">{item.profiles?.full_name}</p>
                    <p className="text-[10px] text-purple-600 font-bold">{item.pickup_time}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{item.profiles?.address}</p>
                  </div>
                )) || <p className="text-xs text-gray-300 italic">No pickups</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
            <h3 className="text-xl font-black text-[#804FB3] mb-2 text-center">Final Weight</h3>
            <p className="text-center text-gray-500 text-sm mb-6">Entering weight will mark this order as <strong>Completed</strong>.</p>
            <input
              type="number"
              className="w-full text-center text-3xl font-black border-2 border-gray-200 p-4 rounded-xl mb-6 focus:border-[#804FB3] outline-none"
              placeholder="0.0"
              autoFocus
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />
            <div className="flex gap-3">
              <button className="flex-1 py-3 font-bold text-gray-400" onClick={() => setShowWeightModal(false)}>Cancel</button>
              <button className="flex-1 py-3 bg-[#804FB3] text-white rounded-xl font-bold shadow-lg" onClick={saveWeight}>Save & Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}