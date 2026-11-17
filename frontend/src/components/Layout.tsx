import { ReactNode, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, ShoppingCart,
  Users, LogOut, Menu, X, Building2, ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

interface LayoutProps { children: ReactNode }

const SIDEBAR_KEY = 'minierp_sidebar_open';

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_KEY);
      return stored !== null ? stored === 'true' : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
    } catch {
      // ignore
    }
  }, [sidebarOpen]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', show: true },
    { to: '/leave', icon: CalendarDays, label: 'Leave', show: true },
    { to: '/purchase', icon: ShoppingCart, label: 'Purchases', show: true },
    { to: '/users', icon: Users, label: 'Users', show: isAdmin },
  ].filter(item => item.show);

  const roleBadgeColor = isAdmin
    ? 'bg-purple-100 text-purple-700'
    : isManager
    ? 'bg-blue-100 text-blue-700'
    : 'bg-green-100 text-green-700';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:relative lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-lg leading-none">MiniERP</span>
            <p className="text-xs text-gray-400 mt-0.5">Internal Operations</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-white active:scale-95 transition-all"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800 transition-colors group">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.department}</p>
            </div>
          </div>
          <span className={cn('mt-2 inline-block w-full text-center px-2 py-1 rounded-lg text-xs font-semibold', roleBadgeColor)}>
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header role="banner" className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 active:scale-95 transition-all"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              Hello, <span className="font-semibold text-gray-900">{user?.name}</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" role="main" className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
