import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

// Convert UTC → Central Time
const toCentral = (dateStr) => {
  const utc = new Date(dateStr + "T00:00:00Z");
  return new Date(
    utc.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Time slots in order
  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:30 AM - 12:30 PM",
    "1:00 PM - 3:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  // Load logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Load today's orders
  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      setLoading(true);

      // Today in Central Time
      const now = new Date();
      const centralToday = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Chicago" })
      );
      const yyyy = centralToday.getFullYear();
      const mm = String(centralToday.getMonth() + 1).padStart(2, "0");
      const dd = String(centralToday.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("pickup_date", todayStr)
        .order("pickup_time", { ascending: true });

      if (!error) setOrders(data);
      setLoading(false);
    };

    loadOrders();
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    // Auto-refresh
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // Trigger notification function
    await supabase.functions.invoke("order-status-update", {
      body: { order_id: orderId, status: newStatus },
    });
  };

  if (!user)
    return (
      <div className="p-6 text-center text-xl text-purple-700">
        Please log in to access the admin dashboard.
      </div>
    );

  if (loading)
    return (
      <div className="p-6 text-center text-xl text-purple-700">
        Loading today’s pickups…
      </div>
    );

  // Group by ZIP for simple route batching
  const groupedByZip = orders.reduce((acc, order) => {
    const zip = order.address?.match(/\b\d{5}\b/)?.[0] || "Unknown ZIP";
    acc[zip] = acc[zip] || [];
    acc[zip].push(order);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
        Today’s Pickups (Central Time)
      </h1>

      {Object.keys(groupedByZip).map((zip) => (
        <div key={zip} className="mb-8">
          <h2 className="text-xl font-semibold text-purple-700 mb-3">
            Route Group: {zip}
          </h2>

          {groupedByZip[zip]
            .sort(
              (a, b) =>
                timeSlots.indexOf(a.pickup_time) -
                timeSlots.indexOf(b.pickup_time)
            )
            .map((order) => (
              <div
                key={order.id}
                className="border border-purple-300 rounded p-4 mb-3 bg-white shadow-sm"
              >
                <div className="font-semibold text-purple-900">
                  {order.full_name}
                </div>
                <div className="text-sm text-purple-700">{order.address}</div>
                <div className="text-sm text-purple-700">
                  {order.pickup_time}
                </div>
                <div className="text-sm text-purple-700">
                  Bags: {order.bags}
                </div>
                <div className="text-sm text-purple-700">
                  Detergent: {order.detergent}
                </div>
                <div className="text-sm text-purple-700">
                  Notes: {order.instructions || "None"}
                </div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  {["pending", "picked_up", "washing", "ready", "delivered"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        className={`px-3 py-1 rounded text-sm ${
                          order.status === status
                            ? "bg-purple-700 text-white"
                            : "bg-purple-200 text-purple-800"
                        }`}
                      >
                        {status.replace("_", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}