export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Orders</h2>
          <p className="text-3xl mt-2">—</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Active Customers</h2>
          <p className="text-3xl mt-2">—</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Revenue</h2>
          <p className="text-3xl mt-2">—</p>
        </div>
      </div>
    </div>
  );
}