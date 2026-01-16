// src/components/Layout.jsx
// src/components/Layout.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, List, PieChart, LogOut } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "text-indigo-400" : "text-slate-400";

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <nav className="fixed bottom-0 w-full bg-[#1e293b]/80 backdrop-blur-md border-t border-slate-700 p-4 flex justify-around md:top-0 md:left-0 md:w-20 md:h-full md:flex-col md:border-r md:border-t-0 z-50">
        <div className="p-2 bg-indigo-500 rounded-lg mb-8 hidden md:block text-center">
          📊
        </div>

        <Link to="/" className={`p-2 transition-colors ${isActive("/")}`}>
          <Home size={24} />
        </Link>

        <Link
          to="/transacciones"
          className={`p-2 transition-colors ${isActive("/transacciones")}`}
        >
          <List size={24} />
        </Link>

        <Link
          to="/insights"
          className={`p-2 transition-colors ${isActive("/insights")}`}
        >
          <PieChart size={24} />
        </Link>

        <button
          onClick={() => supabase.auth.signOut()}
          className="p-2 text-slate-400 hover:text-red-400 mt-auto"
        >
          <LogOut size={24} />
        </button>
      </nav>

      <main className="pb-24 md:pb-6 md:pl-28 p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};
