import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function AdminDashboard({ user }) {

  // ⭐ Prevent mount before user is ready
  if (!user) return null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalOrders, setTotalOrders] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [orders, setOrders] = useState([]);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // Weight modal state
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightOrder, setWeightOrder] = useState(null);
  const [weightInput, setWeightInput] = useState("");

  const ORDER_STATUSES = [
    "scheduled",
    "picked_up",
    "washing",
    "drying",
    "ready_for_delivery",
    "delivered",
    "completed",
  ];

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { count: orderCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        setTotalOrders(orderCount || 0);

        const { count: customerCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("active", true);

        setActiveCustomers(customerCount || 0);

        const { data: revenueData } = await supabase
          .from("orders")
          .select("total_price");

        const totalRevenue = revenueData?.reduce(
          (sum, order) => sum + (order.total_price || 0),
          0
        );

        setRevenue(totalRevenue || 0);

        const { data: allOrders } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        setOrders(allOrders || []);

      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    loadDashboard();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      alert("Order updated and customer notified.");

    } catch (err) {
      alert("Error updating order: " + err.message);
    }

    setUpdatingOrder(null);
  };

  // Save weight
  const saveWeight = async () => {
    if (!weightInput || isNaN(weightInput)) {
      alert("Enter a valid weight.");
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          pounds: Number(weightInput),
          status: "completed",
        })
        .eq("id", weightOrder.id);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === weightOrder.id
            ? { ...o, pounds: Number(weightInput), status: "completed" }
            : o
        )
      );

      alert("Weight saved and order marked completed.");
      setShowWeightModal(false);
      setWeightInput("");
      setWeightOrder(null);

    } catch (err) {
      alert("Error saving weight: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600 text-center">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 text-center">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-[#804FB3] tracking-tight">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="p-4 rounded-xl shadow bg-gradient-to-b from-white to-[#E5E4E2] border border-[#CFCFCF]">
          <h2 className="font-semibold text-[#804FB3]">Total Orders</h2>
          <p className="text-4xl mt-2 font-bold text-gray-900">{totalOrders}</p>
        </div>

        <div className="p-4 rounded-xl shadow bg-gradient-to-b from-white to-[#E5E4E2] border border-[#CFCFCF]">
          <h2 className="font-semibold text-[#804FB3]">Active Customers</h2>
          <p className="text-4xl mt-2 font-bold text-gray-900">{activeCustomers}</p>
        </div>

        <div className="p-4 rounded-xl shadow bg-gradient-to-b from-white to-[#E5E4E2] border border-[#CFCFCF]">
          <h2 className="font-semibold text-[#804FB3]">Revenue</h2>
          <p className="text-4xl mt-2 font-bold text-gray-900">
            ${revenue.toFixed(2)}
          </p>
        </div>

      </div>

      {/* Orders Manager */}
      <div className="bg-white shadow-xl rounded-xl p-4 border border-[#CFCFCF]">
        <h2 className="font-semibold mb-4 text-lg text-[#804FB3]">
          Orders Manager
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-[#E5E4E2]">
                <th className="py-2 px-2 text-[#804FB3]">Customer</th>
                <th className="py-2 px-2 text-[#804FB3]">Status</th>
                <th className="py-2 px-2 text-[#804FB3]">Weight</th>
                <th className="py-2 px-2 text-[#804FB3]">Total</th>
                <th className="py-2 px-2 text-[#804FB3]">Date</th>
                <th className="py-2 px-2 text-[#804FB3]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2 px-2">
                    {order.customer_name || "Unknown"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {order.customer_email}
                    </span>
                  </td>

                  <td className="py-2 px-2 capitalize">{order.status}</td>

                  <td className="py-2 px-2">
                    {order.pounds ? `${order.pounds} lbs` : "—"}
                  </td>

                  <td className="py-2 px-2">${order.total_price?.toFixed(2)}</td>

                  <td className="py-2 px-2">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-2 px-2 space-x-2">
                    <select
                      className="border rounded px-2 py-1 text-[#804FB3] border-[#CFCFCF]"
                      value={order.status}
                      disabled={updatingOrder === order.id}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>

                    <button
                      className="px-3 py-1 rounded bg-gradient-to-r from-[#804FB3] to-[#56941E] text-white shadow"
                      onClick={() => {
                        setWeightOrder(order);
                        setShowWeightModal(true);
                      }}
                    >
                      Enter Weight
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Weight Entry Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 border border-[#CFCFCF]">

            <h3 className="text-lg font-bold mb-4 text-[#804FB3]">
              Enter Laundry Weight
            </h3>

            <input
              type="number"
              className="w-full border p-2 rounded mb-4 border-[#CFCFCF]"
              placeholder="Total pounds"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowWeightModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-gradient-to-r from-[#804FB3] to-[#56941E] text-white rounded shadow"
                onClick={saveWeight}
              >
                Save Weight
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}