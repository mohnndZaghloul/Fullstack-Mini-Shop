import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex min-h-screen flex-col bg-[#1E293B] text-[#94A3B8] transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex items-center border-b border-slate-700/50 px-4 py-5 ${collapsed ? 'justify-center' : ''}`}>
        <Store className="h-7 w-7 text-[#77ec7a]" />
        {!collapsed && <span className="ml-3 text-lg font-bold text-white">Mini Shop</span>}
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#77ec7a] text-black'
                  : 'text-[#94A3B8] hover:bg-slate-700/50 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-slate-700/50 px-4 py-4 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed && user && (
          <div className="mb-3 truncate text-sm text-slate-400">
            {user.email}
          </div>
        )}
        <button
          onClick={logout}
          className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-[#94A3B8] hover:bg-slate-700/50 hover:text-white transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Logout"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-[#1E293B] text-slate-400 hover:text-white"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
