export default function AdminLayout({ children, onBack }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="space-y-3">
          <button className="block w-full text-left px-3 py-2 rounded hover:bg-gray-200">
            Dashboard
          </button>

          <button className="block w-full text-left px-3 py-2 rounded hover:bg-gray-200">
            Orders
          </button>

          <button className="block w-full text-left px-3 py-2 rounded hover:bg-gray-200">
            Customers
          </button>
        </nav>

        <button
          onClick={onBack}
          className="mt-10 px-3 py-2 bg-purple-700 text-white rounded"
        >
          Back to Site
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}