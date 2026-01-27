import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalOrders, setTotalOrders] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [orders, setOrders] = useState([]);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const ORDER_STATUSES = [
    "scheduled",
    "picked_up",
    "washing",
    "drying",
    "ready_for_delivery",
    "delivered",
  ];

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Total orders
        const { count: orderCount, error: orderErr } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        if (orderErr) throw orderErr;
        setTotalOrders(orderCount || 0);

        // Active customers
        const { count: customerCount, error: customerErr } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("active", true);

        if (customerErr) throw customerErr;
        setActiveCustomers(customerCount || 0);

        // Revenue
        const { data: revenueData, error: revenueErr } = await supabase
          .from("orders")
          .select("total_price");

        if (revenueErr) throw revenueErr;

        const totalRevenue = revenueData?.reduce(
          (sum, order) => sum + (order.total_price || 0),
          0
        );

        setRevenue(totalRevenue || 0);

        // Full orders list
        const { data: allOrders, error: ordersErr } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (ordersErr) throw ordersErr;
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

      // Update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      // Edge Function will send notification automatically
      alert("Order updated and customer notified.");
    } catch (err) {
      alert("Error updating order: " + err.message);
    }

    setUpdatingOrder(null);
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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Orders</h2>
          <p className="text-3xl mt-2">{totalOrders}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Active Customers</h2>
          <p className="text-3xl mt-2">{activeCustomers}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Revenue</h2>
          <p className="text-3xl mt-2">${revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders Manager */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-4 text-lg">Orders Manager</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Customer</th>
                <th className="py-2">Status</th>
                <th className="py-2">Total</th>
                <th className="py-2">Date</th>
                <th className="py-2">Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2">
                    {order.customer_name || "Unknown"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {order.customer_email}
                    </span>
                  </td>

                  <td className="py-2 capitalize">{order.status}</td>

                  <td className="py-2">${order.total_price?.toFixed(2)}</td>

                  <td className="py-2">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-2">
                    <select
                      className="border rounded px-2 py-1"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}