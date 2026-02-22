import { Link, useLocation } from "react-router-dom";

export default function AdminLayout({ children, onBack }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white/30 text-white shadow-inner"
      : "bg-white/10 text-white hover:bg-white/20";

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">

      {/* Sidebar */}
      <aside
        className="
          w-64 
          bg-gradient-to-b from-[#804FB3] to-[#56941E]
          text-white 
          shadow-2xl 
          p-5
          flex flex-col
        "
      >
        <h2 className="text-2xl font-extrabold mb-8 tracking-tight">
          Admin Panel
        </h2>

        <nav className="space-y-3 flex-1">

          <Link
            to="/admin"
            className={`
              block w-full text-left px-4 py-2 rounded-lg
              transition-all duration-200 font-medium
              ${isActive("/admin")}
            `}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/orders"
            className={`
              block w-full text-left px-4 py-2 rounded-lg
              transition-all duration-200 font-medium
              ${isActive("/admin/orders")}
            `}
          >
            Orders
          </Link>

          <Link
            to="/admin/customers"
            className={`
              block w-full text-left px-4 py-2 rounded-lg
              transition-all duration-200 font-medium
              ${isActive("/admin/customers")}
            `}
          >
            Customers
          </Link>

        </nav>

        <button
          onClick={onBack}
          className="
            mt-6 px-4 py-2 
            bg-white text-[#804FB3] 
            font-semibold rounded-lg 
            shadow hover:shadow-md
            transition
          "
        >
          Back to Site
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">

        {/* Top bar */}
        <div
          className="
            w-full mb-6 
            bg-white 
            border border-[#CFCFCF] 
            shadow-sm 
            rounded-xl 
            p-4
          "
        >
          <h1 className="text-xl font-bold text-[#804FB3] tracking-tight">
            Admin Dashboard
          </h1>
        </div>

        {children}
      </main>
    </div>
  );
}