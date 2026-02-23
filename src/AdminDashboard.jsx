import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function AdminDashboard({ user, setShowAdmin }) {
  if (!user) return null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("orders"); // 'orders', 'dispatch', or 'usage'

  const [stats, setStats] = useState({ totalOrders: 0, activeCustomers: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [dispatch, setDispatch] = useState({});
  const [usageAudit, setUsageAudit] = useState([]);
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
      
      // 1. Fetch Orders
      const { data: allOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      
      // 2. Fetch Active Customers Count
      const { count: customerCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("active", true);
      
      // 3. Fetch Subscriptions & Profiles for Dispatch and Usage
      const { data: subs } = await supabase
        .from('subscriptions')
        .select(`
          pickup_day, 
          pickup_time, 
          included_lbs, 
          plan_name,
          profiles(id, full_name, phone, address)
        `)
        .eq('active', true);

      // --- PROCESS DATA ---

      // Total Revenue
      const totalRev = allOrders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;
      setStats({ totalOrders: allOrders?.length || 0, activeCustomers: customerCount || 0, revenue: totalRev });
      setOrders(allOrders || []);

      // Group Dispatch by Day
      const groupedDispatch = subs?.filter(s => s.pickup_day).reduce((acc, curr) => {
        const day = curr.pickup_day;
        if (!acc[day]) acc[day] = [];
        acc[day].push(curr);
        return acc;
      }, {}) || {};
      setDispatch(groupedDispatch);

      // Calculate Monthly Usage Audit
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const usageMap = subs?.map(sub => {
        const userOrders = allOrders?.filter(o => 
          o.user_id === sub.profiles?.id && 
          o.status === 'completed' && 
          o.created_at >= startOfMonth
        );
        const used = userOrders?.reduce((sum, o) => sum + (o.pounds || 0), 0) || 0;
        return {
          name: sub.profiles?.full_name || 'Unknown',
          plan: sub.plan_name,
          limit: sub.included_lbs || 0,
          used: used,
          remaining: Math.max((sub.included_lbs || 0) - used, 0),
          overage: Math.max(used - (sub.included_lbs || 0), 0)
        };
      }) || [];
      setUsageAudit(usageMap);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const saveWeight = async () => {
    if (!weightInput || isNaN(weightInput)) return alert("Enter weight.");
    try {
      const { error } = await supabase.from("orders").update({
        pounds: Number(weightInput),
        status: "completed",
      }).eq("id", weightOrder.id);

      if (error) throw error;
      // Refresh all data to update usage audit
      await loadDashboardData();
      setShowWeightModal(false);
      setWeightInput("");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-purple-800 font-bold">Loading Badgerland Admin...</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-black text-[#804FB3]">Admin Portal</h1>
          <nav className="flex gap-2 mt-4">
            <button onClick={() => setActiveView('orders')} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${activeView === 'orders' ? 'bg-[#804FB3] text-white' : 'bg-gray-100 text-gray-500'}`}>Orders</button>
            <button onClick={() => setActiveView('dispatch')} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${activeView === 'dispatch' ? 'bg-[#56941E] text-white' : 'bg-gray-100 text-gray-500'}`}>Weekly Dispatch</button>
            <button onClick={() => setActiveView('usage')} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${activeView === 'usage' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>Usage Audit</button>
          </nav>
        </div>
        <div className="flex gap-6">
          <div className="text-center"><p className="text-[10px] font-bold text-gray-400 uppercase">Customers</p><p className="text-2xl font-black">{stats.activeCustomers}</p></div>
          <div className="text-center"><p className="text-[10px] font-bold text-gray-400 uppercase">Revenue</p><p className="text-2xl font-black text-green-600">${stats.revenue.toFixed(0)}</p></div>
          <button onClick={() => setShowAdmin(false)} className="self-center bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">✕</button>
        </div>
      </div>

      {/* ORDERS VIEW */}
      {activeView === 'orders' && (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-600">Customer</th>
                <th className="p-4 font-bold text-gray-600">Status</th>
                <th className="p-4 font-bold text-gray-600">Lbs</th>
                <th className="p-4 font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4"><p className="font-bold">{o.customer_name || 'Guest'}</p><p className="text-[10px] text-gray-400">{o.customer_email}</p></td>
                  <td className="p-4"><span className="px-2 py-1 rounded-md bg-purple-100 text-[#804FB3] text-[10px] font-bold uppercase">{o.status}</span></td>
                  <td className="p-4 font-mono font-bold">{o.pounds || '--'}</td>
                  <td className="p-4 flex gap-2">
                    <select className="text-[10px] border rounded p-1" value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => { setWeightOrder(o); setShowWeightModal(true); }} className="bg-black text-white px-3 py-1 rounded text-[10px] font-bold">LOG WEIGHT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DISPATCH VIEW */}
      {activeView === 'dispatch' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS.map(day => (
            <div key={day} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#804FB3] p-3 text-white text-center font-bold text-xs uppercase tracking-widest">{day}</div>
              <div className="p-3 space-y-3">
                {dispatch[day]?.map((item, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="font-bold text-sm">{item.profiles?.full_name}</p>
                    <p className="text-[10px] text-[#56941E] font-bold">{item.pickup_time}</p>
                    <p className="text-[10px] text-gray-500 mt-1 leading-tight">{item.profiles?.address}</p>
                    <p className="text-[10px] text-blue-600 mt-1">{item.profiles?.phone}</p>
                  </div>
                )) || <p className="text-center text-gray-300 py-10 text-xs italic">Clear route</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USAGE AUDIT VIEW */}
      {activeView === 'usage' && (
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Monthly Pound Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usageAudit.map((u, i) => (
              <div key={i} className={`p-4 rounded-2xl border-2 ${u.overage > 0 ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-gray-900">{u.name}</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{u.plan}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mb-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${u.overage > 0 ? 'bg-red-500' : 'bg-[#56941E]'}`} 
                    style={{ width: `${Math.min((u.used / u.limit) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <p className="text-gray-500">Used: {u.used} lbs</p>
                  <p className={u.overage > 0 ? "text-red-600" : "text-gray-500"}>
                    {u.overage > 0 ? `Overage: +${u.overage} lbs` : `Left: ${u.remaining} lbs`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEIGHT MODAL */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-[#804FB3] mb-2 text-center">Ticket Weight</h3>
            <p className="text-center text-gray-500 text-sm mb-6">Enter weight for <strong>{weightOrder?.customer_name}</strong></p>
            <div className="relative">
               <input
                type="number"
                className="w-full text-center text-5xl font-black border-4 border-gray-100 p-6 rounded-2xl mb-6 focus:border-[#804FB3] outline-none transition-all"
                placeholder="0.0"
                autoFocus
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
              />
              <span className="absolute right-6 top-1/2 -translate-y-10 font-black text-gray-300">LBS</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition" onClick={() => setShowWeightModal(false)}>CANCEL</button>
              <button className="flex-1 py-4 bg-[#804FB3] text-white rounded-2xl font-bold shadow-lg hover:bg-purple-700 transition" onClick={saveWeight}>COMPLETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}