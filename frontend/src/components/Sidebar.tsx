import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  Users,
  LogOut,
  X,
  Building2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/leave', icon: Calendar, label: 'Leave', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/purchase', icon: ShoppingCart, label: 'Purchase', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/users', icon: Users, label: 'Users', roles: ['ADMIN'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30',
          'flex flex-col transition-transform duration-300',
          'lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold tracking-tight">MiniERP</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems
            .filter((item) => item.roles.includes(user?.role || ''))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
// fix: sidebar active link highlight on nested routes
